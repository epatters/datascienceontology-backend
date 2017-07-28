import OpenWhisk = require("openwhisk");

import { Annotation } from "../interfaces/annotation";
import { Cache } from "../interfaces/cache";
import * as Cytoscape from "../interfaces/cytoscape";


export interface ActionParams {
  /* Document ID of created or updated annotation. */
  id: string;
}

export interface ActionResult {
  /* Document ID of cached computation results for annotation, if any. */
  id: string;
}

/** Action that is invoked whenever a annotation document is created or updated.
 */
export default function action(params: ActionParams): Promise<ActionResult> {
  let cache: Cache = {
    schema: "cache",
    _id: `cache/${params.id}`,
    key: params.id
  };
  let doc: Annotation = null;
  
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
    if (!(doc.schema === "annotation" && doc.kind === "morphism")) {
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
    }).then(result => result.response.result);
  }, reason => {
    if (reason !== "skip") {
      console.log(reason);
      throw reason;
    }
    return { id: null, ok: true };
  });
}
global.main = action;
