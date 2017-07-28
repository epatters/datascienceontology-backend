/* Top-level interface for Cytoscape graph data.
 */
export interface Cytoscape {
  container?: HTMLElement;
  elements?: Element[];
  layout?: Layout;
  style?: string | Style[];
}

/* Cytoscape element: node or edge.
   http://js.cytoscape.org/#notation/elements-json
 */
export interface Element {
  /* Kind of element: "node" or "edge" */
  group?: string;
  
  /* Space-separated list of classes element belongs to */
  classes?: string;
  
  /* Element data */
  data: ElementData;
  
  /* "Scratchpad data" that is temporary or non-serializable */
  scratch?: {};

  /* Position of node (specifically, the center of the node) */
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
  
  /* Other JSON-serializable data, not consumed by Cytoscape. */
  [other: string]: any;
}

export type ElementID = number | string;

export interface Layout {
  name: string;
}

/* Cytoscape style for node and edges.
   http://js.cytoscape.org/#style/format
 */
export interface Style {
  /* Style selector ala CSS. 
     http://js.cytoscape.org/#selectors
  */
  selector: string;
  
  /* Style key-value pairs. */
  style: StyleData;
}

export interface StyleData {
  [key: string]: any;
}
