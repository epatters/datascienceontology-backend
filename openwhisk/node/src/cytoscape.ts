import * as Graphviz from "./graphviz";

/* Top-level interface for Cytoscape graph data.
 */
export interface Cytoscape {
  container?: HTMLElement;
  elements: Element[];
  layout: Layout;
  style?: string | Style[];
}

/* Cytoscape element: node or edge.
   http://js.cytoscape.org/#notation/elements-json
 */
export interface Element {
  /* Kind of element: "node" or "edge" */
  group?: string;
  
  /* Space-separated list of classes element belongs to */
  class?: string;
  
  /* Element data */
  data: ElementData;
  
  /* "Scratchpad data" not consumed by Cytoscape. */
  scratch?: {};

  /* Position of node (specifically, the center of the node). */
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
  style: {};
}


/* Convert Graphviz xdot output (parsed as JSON) into Cytoscape data.
 */
export function dotToCytoscape(dot: Graphviz.Graph): Cytoscape {
  let elements: Element[] = [];
  let styles: Style[] = [];
  
  // Convert nodes, ignoring the subgraphs. Note that this does not exclude
  // any nodes, only the subgraph structure.
  const offset = dot._subgraph_cnt;
  for (let obj of dot.objects.slice(offset)) {
    const [element, style] = dotNodeToCytoscape(obj as any); // obj as Node
    elements.push(element);
    styles.push(style);
  }
  
  // Convert edges.
  for (let edge of dot.edges) {
    const element: Element = {
      group: "edge",
      data: {
        source: elements[edge.tail - offset].data.id,
        target: elements[edge.head - offset].data.id,
      }
    };
    elements.push(element);
  }
  
  return {
    elements: elements,
    layout: {
      name: "preset"
    },
    style: styles
   };
}

function dotNodeToCytoscape(node: Graphviz.Node): [Element, Style] {
  const position = parseFloatArray(node.pos);
  return [
    {
      group: "node",
      data: {
        id: node.name
      },
      // Position refers to node *center* in both Graphviz and Cytoscape.
      position: {
        x: position[0],
        y: position[1]
      }
    },
    {
      selector: "#" + node.name,
      style: {
        width: parseFloat(node.width),
        height: parseFloat(node.height)
      }
    }
  ]
}

function parseFloatArray(s: string): number[] {
  return s.split(",").map(parseFloat);
}
