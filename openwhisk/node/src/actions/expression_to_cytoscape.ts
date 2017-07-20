import OpenWhisk = require("openwhisk");
import * as Cytoscape from "../cytoscape";


export interface ActionParams {
  /* Morphism as S-expression */
  data: {};
}

export interface ActionResult {
  /* Elements JSON in Cytoscape format. */
  data: Cytoscape.Cytoscape;
}

/* Convert morphism to wiring diagram in Cytoscape format.

  This simple composition should be a sequence action in OpenWhisk, but that's
  not currently possible because sequences don't support default parameters:
  https://github.com/apache/incubator-openwhisk/issues/2008
 */
export default function action(params: ActionParams): Promise<ActionResult> {
  const openwhisk = OpenWhisk()
  return openwhisk.actions.invoke({
    name: "data-science-ontology/catlab",
    blocking: true,
    params: {
      action: "expression_to_graphviz",
      data: params.data
    }
  }).then((result) => {
    return openwhisk.actions.invoke({
      name: "data-science-ontology/graphviz_to_cytoscape",
      blocking: true,
      params: {
        data: result.response.result.data
      }
    })
  }).then((result) => {
    return {
      data: result.response.result.data
    }
  })
}
global.main = action;
