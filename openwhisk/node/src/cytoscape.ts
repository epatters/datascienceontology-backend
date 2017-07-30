import * as assert from "assert";

import * as Cytoscape from "./interfaces/cytoscape";
import * as Graphviz from "./interfaces/graphviz";

// XXX: Official types are borked due to TypeScript/CommonJS incompatibility:
// https://github.com/Microsoft/TypeScript/issues/5565#issuecomment-155171298
const striptags: (html: string) => string = require("striptags");


export interface DotToCytoscapeOptions {
  /* Whether to manually set edge source and target endpoints (default false) */
  edgeEndPoints?: boolean;
}

/* Convert Graphviz xdot output (parsed as JSON) into Cytoscape data.
 */
export function dotToCytoscape(dot: Graphviz.Graph, opts: DotToCytoscapeOptions = {}):
    Cytoscape.Cytoscape {
  let elements: Cytoscape.Element[] = [];
  
  /* Use bounding box to transform coordinates.
  
  Graphviz uses the "default" Cartesian coordinate system (origin in bottom
  left corner), while Cytoscape uses the HTML coordinate system (origin in top
  left corner). It seems (but is not documented) that the first two numbers in
  the Graphviz bounding box are always (0,0).
  */
  const bb = parseFloatArray(dot.bb);
  const transformPoint = (point: Point): Point => (
    { x: point.x, y: bb[3] - point.y }
  );
  
  // Convert nodes, ignoring the subgraphs. Note that this does not exclude
  // any nodes, only the subgraph structure.
  const offset = dot._subgraph_cnt;
  for (let obj of dot.objects.slice(offset)) {
    elements.push(dotNodeToCytoscape(obj as any, transformPoint, opts));
  }
  
  // Convert edges.
  const getNode = (id: number) => elements[id - offset];
  for (let edge of dot.edges) {
    if (edge.style === "invis") {
      // Omit invisible edges, which are used to tweak layout in Graphviz.
      continue;
    }
    elements.push(dotEdgeToCytoscape(edge, getNode, transformPoint, opts));
  }
  
  // Return elements data along with default styles.
  let edgeStyle: Cytoscape.StyleData = {
    label: "data(label)"
  }
  if (opts.edgeEndPoints) {
    edgeStyle["source-endpoint"] = "data(sourceEndpoint)";
    edgeStyle["target-endpoint"] = "data(targetEndpoint)";
  }
  return {
    elements: elements,
    layout: {
      name: "preset"
    },
    style: [
      {
        selector: "node.graphviz",
        style: {
          label: "data(label)",
          width: "data(width)",
          height: "data(height)"
        }
      },
      {
        selector: "edge.graphviz",
        style: edgeStyle
      },
      {
        selector: ".graphviz-invis",
        style: {
          visibility: "hidden"
        }
      }
    ]
   };
}

function dotNodeToCytoscape(node: Graphviz.Node,
    transformPoint: (point: Point) => Point,
    opts: DotToCytoscapeOptions = {}): Cytoscape.Element {
  // Create element data.
  let data: Cytoscape.ElementData = {
   /* Confusingly, we assign the Graphviz name to the Cytoscape ID and vice
      versa. The reason is that the Graphviz names are guaranteed to be unique,
      while the user-defined Graphviz IDs need not be.
    */
    id: node.name,
    
    // Only assign label if node default is overridden.
    // Strip all tags from Graphviz "HTML-like" labels.
    label: node.label !== "\\N" ? striptags(node.label).trim() : node.name,
    
    width: round(inchesToPoints(parseFloat(node.width)), 3),
    height: round(inchesToPoints(parseFloat(node.height)), 3)
  }
  if (node.id !== undefined) {
    data.name = node.id;
  }

  // Create element.
  let classes = [ "graphviz" ];
  if (node.style !== undefined) {
    classes.push(`graphviz-${node.style}`);
  }
  return {
    group: "nodes",
    classes: classes.join(" "),
    data: data,
    // Position refers to node *center* in both Graphviz and Cytoscape.
    position: transformPoint(parsePoint(node.pos))
  };  
}

function dotEdgeToCytoscape(edge: Graphviz.Edge,
    getNode: (id: number) => Cytoscape.Element,
    transformPoint: (point: Point) => Point,
    opts: DotToCytoscapeOptions = {}): Cytoscape.Element {
  // Create element data.
  const source = getNode(edge.tail);
  const target = getNode(edge.head);
  let data: Cytoscape.ElementData = {
    source: source.data.id,
    target: target.data.id
  }
  if (edge.id !== undefined) {
    data.name = edge.id;
  }
  if (edge.xlabel !== undefined) {
    data.label = edge.xlabel;
  } else if (edge.label !== undefined) {
    data.label = edge.label;
  }
  if (opts.edgeEndPoints) {
    const spline = parseSpline(edge.pos);
    const startPoint = transformPoint(spline[0]);
    const endPoint = transformPoint(spline.slice(-1)[0]);
    data.sourceEndpoint = [
      round(startPoint.x - source.position.x, 3),
      round(startPoint.y - source.position.y, 3)
    ];
    data.targetEndpoint = [
      round(endPoint.x - target.position.x, 3),
      round(endPoint.y - target.position.y, 3)
    ];
  }
  
  // Create element.
  let classes = [ "graphviz" ];
  if (edge.style !== undefined) {
    classes.push(`graphviz-${edge.style}`);
  }
  return {
    group: "edges",
    classes: classes.join(" "),
    data: data
  };
}


interface Point {
  x: number;
  y: number;
}

function parseFloatArray(s: string): number[] {
  return s.split(",").map(parseFloat);
}

/* Parse Graphviz point.

  http://www.graphviz.org/doc/info/attrs.html#k:point
*/
function parsePoint(s: string): Point {
  const point = parseFloatArray(s);
  assert(point.length == 2);
  return { x: point[0], y: point[1] }
}

/* Parse Graphviz spline.

  http://www.graphviz.org/doc/info/attrs.html#k:splineType
*/
function parseSpline(spline: string): Point[] {
  let points: Point[] = [];
  let startPoint: Point = null;
  let endPoint: Point = null;
  
  spline.split(" ").forEach((s) => {
    if (s.startsWith("s,")) {
      startPoint = parsePoint(s.slice(2));
    } else if (s.startsWith("e,")) {
      endPoint = parsePoint(s.slice(2));
    } else {
      points.push(parsePoint(s));
    }
  });
  
  if (startPoint !== null) {
    points.splice(0, 0, startPoint);
  }
  if (endPoint !== null) {
    points.push(endPoint);
  }
  return points;    
}

// 72 points per inch in Graphviz.
const inchesToPoints = (x: number) => 72*x;

function round(x: number, places: number = 0) {
  const mult = 10**places;
  return Math.round(x * mult) / mult;
}
