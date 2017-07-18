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
export function xdotToCytoscape(xdot: any): Cytoscape {
  let elements: Element[] = [];
  let styles: Style[] = [];
  
  // Walk the xdot AST, picking out nodes and edges.
  // FIXME: Graphivz subgraphs should become Cytoscape subgraphs. Currently we
  // are flattening the hierarchy.
  function walk(doc: any) {
    switch(doc.type) {
      case "graph":
      case "digraph":
      case "subgraph":
        doc.statements.forEach(walk);
        break;
      case "node":
        let [element, style] = xdotNodeToCytoscape(doc);
        elements.push(element);
        styles.push(style);
        break;
      case "edge":
        elements.push(xdotEdgeToCytoscape(doc));
      default:
        break;
    }
  };
  walk(xdot);
  
  return {
    elements: elements,
    layout: {
      name: "preset"
    },
    style: styles
   };
}

function xdotNodeToCytoscape(node: any): [Element, Style] {
  const position: number[] = node.attributes["pos"];
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
        width: node.attributes["width"],
        height: node.attributes["height"]
      }
    }
  ]
}

function xdotEdgeToCytoscape(edge: any): Element {
  return {
    group: "edge",
    data: {
      source: edge.source,
      target: edge.target,
    }
  }
}
