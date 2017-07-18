
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
export function xdot_to_elements(xdot: any): Element[] {
  let elements: Element[] = [];
  
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
        elements.push(xdot_node_to_element(doc));
        break;
      case "edge":
        elements.push(xdot_edge_to_element(doc));
      default:
        break;
    }
  };
  
  walk(xdot);
  return elements;
}

function xdot_node_to_element(node: any): Element {
  const position: number[] = node.attributes["pos"];
  return {
    group: "node",
    data: {
      id: node.name
    },
    position: {
      x: position[0],
      y: position[1]
    }
  }
}

function xdot_edge_to_element(edge: any): Element {
  return {
    group: "edge",
    data: {
      source: edge.source,
      target: edge.target,
    }
  }
}
