import OpenWhisk = require("openwhisk");

import { Cache } from "../interfaces/cache";
import { Concept } from "../interfaces/concept";
import * as Cytoscape from "../interfaces/cytoscape";


export interface ActionParams {
  /* Document ID of created or updated concept. */
  id: string;
}

export interface ActionResult {
  /* Document ID of cached computation results for concept, if any. */
  id: string;
}

/* Action that is fired whenever a concept document is created or updated.
 */
export default function action(params: ActionParams): Promise<ActionResult> {
  let cache: Cache = {
    _id: ["cache", params.id].join("/"),
    key: params.id
  };
  let doc: Concept = null;
  
  const openwhisk = OpenWhisk();
  return openwhisk.actions.invoke({
    name: "Bluemix_Cloudant_Root/read",
    blocking: true,
    params: {
      dbname: "data-science-ontology",
      id: params.id
    }
  }).then(result => {
    doc = result.response.result;
    if (!(doc.schema === "concept" && 
          doc.kind === "morphism" && doc.definition !== undefined)) {
      throw "skip";
    }
    return openwhisk.actions.invoke({
      name: "data-science-ontology/morphism_to_cytoscape",
      blocking: true,
      params: {
        expression: doc.definition
      }
    });
  }).then(result => {
    const cy: Cytoscape.Cytoscape = result.response.result.cytoscape;
    cache.definition = {
      expression: doc.definition,
      cytoscape: cy
    }
    return openwhisk.actions.invoke({
      name: "Bluemix_Cloudant_Root/write",
      blocking: true,
      params: {
        dbname: "data-science-ontology",
        doc: cache
      }
    });
  }, reason => {
    if (reason !== "skip") {
      console.log(reason);
      throw reason;
    }
    return {id: null};
  }).then(result => result.response.result);
}
global.main = action;
