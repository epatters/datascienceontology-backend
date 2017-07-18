import * as Cytoscape from "../cytoscape";
import * as DotParser from "../grammar/xdot.js";


export interface ActionParams {
  /* Graphviz output in xdot format. */
  xdot: string
}

export interface ActionResult {
  /* Elements JSON in Cytoscape format. */
  cytoscape: Cytoscape.Cytoscape;
}

/* Convert Graphviz output to Cytoscape data.
 */
export default function action(params: ActionParams): ActionResult {
  const xdot = DotParser.parse(params.xdot);  
  return { cytoscape: Cytoscape.xdotToCytoscape(xdot) };
}
