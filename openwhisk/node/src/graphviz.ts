/* Top-level interface for Graphviz JSON output (new in Graphviz 2.40).
   http://www.graphviz.org/doc/info/output.html#d:json
   
   JSON is produced using the `json` (`xdot` equivalent) or `json0` (`dot`
   equivalent) Graphviz output formats. The xdot drawing instructions are not
   included in this interface.
 */
export interface Graph {
  name: string;
  directed: boolean;
  strict: boolean;
  _subgraph_cnt: 0;
  
  objects: MetaNode[];
  edges: Edge[];
}

/* Node or subgraph in Graphviz JSON output.
 */
export interface MetaNode {
  /* Index of node or subgraph in `objects` array. */
  _gvid: number;
  
  /* Name of node or subgraph in dot file. */
  name: string;
  
  label?: string;
  pos?: string;
  width?: string;
  height?: string;
}

export interface Edge {
  /* Index of edge in `edges` array. */
  _gvid: number;
  
  head: number;
  tail: number;
  
  pos?: string;
}
