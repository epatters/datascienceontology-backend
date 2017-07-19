import * as Cytoscape from "../cytoscape";
import * as Graphviz from "../graphviz";


export interface ActionParams {
  /* Graphviz output in JSON format. */
  data: Graphviz.Graph;
}

export interface ActionResult {
  /* Elements JSON in Cytoscape format. */
  data: Cytoscape.Cytoscape;
}

/* Convert Graphviz output to Cytoscape data.
 */
export default function action(params: ActionParams): ActionResult {
  return { data: Cytoscape.dotToCytoscape(params.data) };
}
global.main = action;
