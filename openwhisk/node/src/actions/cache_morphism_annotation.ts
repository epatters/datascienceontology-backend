import * as assert from "assert";
import OpenWhisk = require("openwhisk");

import { Annotation } from "../interfaces/annotation";
import { AnnotationCache } from "../interfaces/annotation_cache";
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
  let doc: Annotation = null;
  let cy: Cytoscape.Cytoscape = null;
  let cache: AnnotationCache = null;
  
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
        definition: {
          expression: doc.definition
        }
      };
    });
  }).then(() => {
    cache.definition.cytoscape = cy;
    return openwhisk.actions.invoke({
      name: "Bluemix_Cloudant_Root/write",
      blocking: true,
      params: {
        dbname: "data-science-ontology-webapp",
        doc: cache
      }
    }).then(result => result.response.result);
  });
}
global.main = action;
