import OpenWhisk = require("openwhisk");

import * as Cytoscape from "../cytoscape";
import * as Graphviz from "../graphviz";


export interface ActionParams {
  /* Morphism as S-expression */
  expr: {};
}

export interface ActionResult {
  /* Elements JSON in Cytoscape format. */
  cytoscape: Cytoscape.Cytoscape;
}

/* Convert morphism expression to wiring diagram in Cytoscape format.
 */
export default function action(params: ActionParams): Promise<ActionResult> {
  const openwhisk = OpenWhisk()
  return openwhisk.actions.invoke({
    name: "data-science-ontology/catlab",
    blocking: true,
    params: {
      action: "expression_to_graphviz",
      expr: params.expr
    }
  }).then((result) => {
    return openwhisk.actions.invoke({
      name: "data-science-ontology/graphviz_to_cytoscape",
      blocking: true,
      params: {
        graph: result.response.result.data,
      }
    })
  }).then((result) => result.response.result);
}
global.main = action;
