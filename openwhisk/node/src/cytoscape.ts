
/* Cytoscape element: node or edge.
   http://js.cytoscape.org/#notation/elements-json
 */
export interface Element {
  /* Kind of element: "node" or "edge" */
  group?: string;
  
  /* Space-separated list of classes element belongs to */
  class?: string;
  
  /* Element data */
  data?: ElementData;
  
  /* "Scratchpad data" not consumed by Cytoscape. */
  scratch?: {};

  /* Position of node. */
  position?: {
    x: number,
    y: number,
  }
}

export interface ElementData {
  /* ID of element, assigned by Cytoscape if undefined. */
  id?: ElementID;
  
  /* Source of edge. Not defined for nodes. */
  source?: ElementID;
  
  /* Target of edge. Not defined for nodes. */
  target?: ElementID;
  
  /* Parent of element, if a compound node. */
  parent?: ElementID;
}

type ElementID = number | string;


/* Convert Graphviz xdot output (parsed as JSON) into Cytoscape elements.
 */
export function xdot_to_elements(xdot: {}): Array<Element> {
  // TODO
  return [];
}
