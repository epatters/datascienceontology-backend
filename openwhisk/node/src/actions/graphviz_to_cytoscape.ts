import OpenWhisk = require("openwhisk");

import * as Cytoscape from "../interfaces/cytoscape";
import * as Graphviz from "../interfaces/graphviz";
import { dotToCytoscape, DotToCytoscapeOptions } from "../cytoscape";


export interface ActionParams extends DotToCytoscapeOptions {
  /* Graphviz input in dot format. */
  graph: string;
}

export interface ActionResult {
  /* Graphviz output in JSON format. */
  graphviz: Graphviz.Graph;
  
  /* Elements JSON in Cytoscape format. */
  cytoscape: Cytoscape.Cytoscape;
}

/* Convert Graphviz graph to Cytoscape data.
 */
export default function action(params: ActionParams): Promise<ActionResult> {
  const openwhisk = OpenWhisk();
  return openwhisk.actions.invoke({
    name: "data-science-ontology/graphviz",
    blocking: true,
    params: {
      graph: params.graph,
      format: "json0"
    }
  }).then((result) => {
    const graphviz = JSON.parse(result.response.result.data) as Graphviz.Graph;
    return {
      graphviz,
      cytoscape: dotToCytoscape(graphviz, params)
    }
  });
}
global.main = action;
