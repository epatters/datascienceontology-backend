import * as assert from "assert";
import OpenWhisk = require("openwhisk");

import { Annotation, Cytoscape, Graphviz } from "open-discovery";


export interface ActionParams {
  /* Document ID of morphism annotation. */
  id: string;
}

export interface ActionResult {
  /* Document ID of cached data for annotation, if any. */
  id: string;
}

/** Create or update the cached data for a morphism annotation.
 */
export default function action(params: ActionParams): Promise<ActionResult> {
  let doc: Annotation = null;
  let graphviz: Graphviz.Graph = null;
  let cytoscape: Cytoscape.Cytoscape = null;
  let cache: any = null;
  
  const openwhisk = OpenWhisk();
  return openwhisk.actions.invoke({
    name: "Bluemix_Cloudant_Root/read",
    blocking: true,
    params: {
      dbname: "data-science-ontology",
      id: params.id
    }
  }).then(result => {
    doc = result.response.result as Annotation;
    assert(doc.schema === "annotation" && doc.kind === "morphism");
    return openwhisk.actions.invoke({
      name: "open-discovery/morphism_to_cytoscape",
      blocking: true,
      params: {
        expression: doc.definition
      }
    })
  }).then(result => {
    graphviz = result.response.result.graphviz;
    cytoscape = result.response.result.cytoscape;
    return openwhisk.actions.invoke({
      name: "Bluemix_Cloudant_Root/read",
      blocking: true,
      params: {
        dbname: "data-science-ontology-webapp",
        id: params.id
      }
    }).then(result => {
      cache = result.response.result;
    }, result => {
      const error = result.error.response.result.error;
      assert.equal(error.error, "not_found");
      cache = {
        _id: params.id,
        language: doc.language,
        package: doc.package,
        id: doc.id,
        kind: doc.kind,
        definition: {
          expression: doc.definition
        }
      };
    });
  }).then(() => {
    Object.assign(cache.definition, { graphviz, cytoscape });
    return openwhisk.actions.invoke({
      name: "Bluemix_Cloudant_Root/write",
      blocking: true,
      params: {
        dbname: "data-science-ontology-webapp",
        doc: cache
      }
    }).then(result => result.response.result as ActionResult);
  });
}
global.main = action;
