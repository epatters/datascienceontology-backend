/* Top-level interface for Graphviz JSON output (new in Graphviz 2.40).
   http://www.graphviz.org/doc/info/output.html#d:json
   
   JSON is produced using the `json` (`xdot` equivalent) or `json0` (`dot`
   equivalent) Graphviz output formats. The xdot drawing instructions are not
   included in this interface.
 */
export interface Graph {
  /* Name of the top-level graph. */
  name: string;
  
  directed: boolean;
  strict: boolean;
  
  /* Number of subgraphs in the graph. */
  _subgraph_cnt: number;
  
  /* Nodes and subgraphs in the graph.
     The first `_subgraph_cnt` objects are subgraphs; the rest are nodes.
   */
  objects: MetaNode[];
  
  /* Edges in the graph. */
  edges: Edge[];
}

/* Node or subgraph in Graphviz JSON output.
 */
export interface MetaNode {
  /* Index of node or subgraph in `objects` array. */
  _gvid: number;
  
  /* User-defined ID, ignored by Graphviz. */
  id?: string;
  
  /* Name of node or subgraph in dot file. */
  name: string;
  
  /* Text label attached to object. */
  label?: string;
}

export interface Node extends MetaNode {
  /* Position of node as comma-separated pair, in points (72 points/inch) */
  pos?: string;
  
  /* Width of node in inches. */
  width?: string;
  
  /* Height of node in inches. */
  height?: string;
}

export interface Subgraph extends MetaNode {
  /* Nodes (or subgraphs) in graph that are contained in this subgraph. */
  nodes: number[];
  
  /* Edges in graph that are contained in this subgraph. */
  edges: number[];
}

export interface Edge {
  /* Index of edge in `edges` array. */
  _gvid: number;
  
  /* User-defined ID, ignored by Graphviz. */
  id?: string;
  
  head: number;
  tail: number;
  
  pos?: string;
}
