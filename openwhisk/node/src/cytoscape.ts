import * as Cytoscape from "./interfaces/cytoscape";
import * as Graphviz from "./interfaces/graphviz";

// XXX: Official types are borked due to TypeScript/CommonJS incompatibility:
// https://github.com/Microsoft/TypeScript/issues/5565#issuecomment-155171298
const striptags: (html: string) => string = require("striptags");


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
    style: [
      {
        selector: "node",
        style: {
          label: "data(id)"
        }
      },
      ...styles
    ]
   };
}

function dotNodeToCytoscape(node: Graphviz.Node): [Cytoscape.Element, Cytoscape.Style] {
  const dpi = 72; // 72 points per inch in Graphviz
  const inchesToPoints = (x: number) => Math.round(dpi * x * 1000) / 1000
  
  // Create element data. Confusingly, we assign the Graphviz name to the
  // Cytoscape ID and vice versa. The reason is that the Graphviz names are
  // guaranteed to be unique, while the user-defined IDs need not be.
  let data: Cytoscape.ElementData = {
    id: node.name
  }
  if (node.id !== undefined) {
    data.name = node.id;
  }
  
  // Create style data. Only assign label if node default is overridden.
  let style: Cytoscape.StyleData = {
    width: inchesToPoints(parseFloat(node.width)),
    height: inchesToPoints(parseFloat(node.height))
  }
  if (node.style === "invis") {
    style.visibilty = "hidden";
  } else if (node.label !== "\\N") {
    // Strip tags in Graphviz "HTML-like" labels.
    style.label = striptags(node.label).trim();
  }
  
  const position = parseFloatArray(node.pos);
  return [
    {
      group: "node",
      data: data,
      position: {
        // Position refers to node *center* in both Graphviz and Cytoscape.
        x: position[0],
        y: position[1]
      }
    },
    {
      selector: "#" + node.name,
      style: style
    }
  ]
}

function parseFloatArray(s: string): number[] {
  return s.split(",").map(parseFloat);
}
