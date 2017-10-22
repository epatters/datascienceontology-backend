import * as assert from "assert";
import OpenWhisk = require("openwhisk");

import { Cytoscape, Graphviz } from "open-discovery";
import { Annotation } from "../interfaces/annotation";
import { AnnotationCache } from "../interfaces/annotation_cache";
import * as Config from "../config";


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
  let cache: AnnotationCache = null;
  
  const openwhisk = OpenWhisk();
  return openwhisk.actions.invoke({
    name: "Bluemix_Cloudant_Root/read",
    blocking: true,
    params: {
      dbname: Config.db_name,
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
    graphviz = result.response.result.graphviz;
    cytoscape = result.response.result.cytoscape;
    return openwhisk.actions.invoke({
      name: "Bluemix_Cloudant_Root/read",
      blocking: true,
      params: {
        dbname: Config.app_db_name,
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
    Object.assign(cache.definition, { graphviz, cytoscape });
    return openwhisk.actions.invoke({
      name: "Bluemix_Cloudant_Root/write",
      blocking: true,
      params: {
        dbname: Config.app_db_name,
        doc: cache
      }
    }).then(result => result.response.result);
  });
}
global.main = action;
