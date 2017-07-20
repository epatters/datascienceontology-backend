import * as Cytoscape from "../cytoscape";
import * as Graphviz from "../graphviz";


export interface ActionParams {
  /* Graphviz output in JSON format. */
  dot: Graphviz.Graph;
}

export interface ActionResult {
  /* Elements JSON in Cytoscape format. */
  cytoscape: Cytoscape.Cytoscape;
}

/* Convert Graphviz output to Cytoscape data.
 */
export default function action(params: ActionParams): ActionResult {
  return { cytoscape: Cytoscape.dotToCytoscape(params.dot) };
}
global.main = action;
