import * as Cytoscape from "../cytoscape";
import * as Graphviz from "../graphviz";


export interface ActionParams {
  /* Graphviz output in JSON format. */
  graph: Graphviz.Graph;
}

export interface ActionResult {
  /* Elements JSON in Cytoscape format. */
  cytoscape: Cytoscape.Cytoscape;
}

/* Convert Graphviz JSON output to Cytoscape data.
 */
export default function action(params: ActionParams): ActionResult {
  return { cytoscape: Cytoscape.dotToCytoscape(params.graph) };
}
global.main = action;
