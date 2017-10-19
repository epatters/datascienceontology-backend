import OpenWhisk = require("openwhisk");

import { SExp } from "../interfaces/expression";
import * as Cytoscape from "../interfaces/cytoscape";
import * as Graphviz from "../interfaces/graphviz";


export interface ActionParams {
  /* Morphism expression */
  expression: SExp;
}

export interface ActionResult {
  /* Graphviz output in JSON format. */
  graphviz: Graphviz.Graph;
  
  /* Elements JSON in Cytoscape format. */
  cytoscape: Cytoscape.Cytoscape;
}

/* Convert morphism expression to wiring diagram in Cytoscape format.
 */
export default function action(params: ActionParams): Promise<ActionResult> {
  const openwhisk = OpenWhisk();
  return openwhisk.actions.invoke({
    name: "data-science-ontology/morphism_to_graphviz",
    blocking: true,
    params: {
      expression: params.expression,
      labels: true,
      xlabel: true,
      graph_attrs: {
        fontname: "Helvetica",
        fontsize: "12"
      },
      node_attrs: {
        fontname: "Helvetica",
        fontsize: "12"
      },
      edge_attrs: {
        fontname: "Helvetica",
        fontsize: "12",
        arrowhead: "none"
      }
    }
  }).then((result) => {
    return openwhisk.actions.invoke({
      name: "data-science-ontology/graphviz_to_cytoscape",
      blocking: true,
      params: {
        graph: result.response.result.data,
        edgeEndPoints: true,
        controlPoints: true
      }
    })
  }).then((result) => result.response.result);
}
global.main = action;
