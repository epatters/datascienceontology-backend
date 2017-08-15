import * as assert from "assert";
import OpenWhisk = require("openwhisk");

import { Annotation } from "../interfaces/annotation";
import { Cache } from "../interfaces/cache";
import * as Cytoscape from "../interfaces/cytoscape";


export interface ActionParams {
  /* Document ID of morphism annotation. */
  id: string;
}

export interface ActionResult {
  /* Document ID of cached computation results for annotation, if any. */
  id: string;
}

/** Create or update the cached data for a morphism annotation.
 */
export default function action(params: ActionParams): Promise<ActionResult> {
  const cache_id = `cache/${params.id}`
  let doc: Annotation = null;
  let cy: Cytoscape.Cytoscape = null;
  let cache: Cache = null;
  
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
    assert(doc.schema === "annotation" && doc.kind === "morphism");
    return openwhisk.actions.invoke({
      name: "data-science-ontology/morphism_to_cytoscape",
      blocking: true,
      params: {
        expression: doc.definition
      }
    })
  }).then(result => {
    cy = result.response.result.cytoscape;
    return openwhisk.actions.invoke({
      name: "Bluemix_Cloudant_Root/read",
      blocking: true,
      params: {
        dbname: "data-science-ontology",
        id: cache_id
      }
    }).then(result => {
      cache = result.response.result;
    }, result => {
      const error = result.error.response.result.error;
      assert.equal(error.error, "not_found");
      cache = {
        schema: "cache",
        _id: cache_id,
        key: params.id
      };
    });
  }).then(() => {
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
  });
}
global.main = action;
