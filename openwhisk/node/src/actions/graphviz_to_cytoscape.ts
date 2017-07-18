import * as Cytoscape from "../cytoscape";
import * as DotParser from "../grammar/xdot.js";


export interface ActionParams {
  /* Graphviz output in xdot format. */
  xdot: string
}

export interface ActionResult {
  /* Elements JSON in Cytoscape format. */
  elements: Cytoscape.Element[];
}

/* Convert Graphviz output to Cytoscape elements.
 */
export default function action(params: ActionParams): ActionResult {
  const xdot = DotParser.parse(params.xdot);  
  return { elements: Cytoscape.xdotToElements(xdot) };
}
