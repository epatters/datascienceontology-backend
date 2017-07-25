import * as Cytoscape from "./interfaces/cytoscape";
import * as Graphviz from "./interfaces/graphviz";


/* Convert Graphviz xdot output (parsed as JSON) into Cytoscape data.
 */
export function dotToCytoscape(dot: Graphviz.Graph): Cytoscape.Cytoscape {
  let elements: Cytoscape.Element[] = [];
  let styles: Cytoscape.Style[] = [];
  
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
    const element: Cytoscape.Element = {
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

function dotNodeToCytoscape(node: Graphviz.Node): [Cytoscape.Element, Cytoscape.Style] {
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
