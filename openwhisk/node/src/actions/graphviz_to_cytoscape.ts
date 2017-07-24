import OpenWhisk = require("openwhisk");

import * as Cytoscape from "../cytoscape";
import * as Graphviz from "../graphviz";


export interface ActionParams {
  /* Graphviz input in dot format. */
  graph: string;
}

export interface ActionResult {
  /* Elements JSON in Cytoscape format. */
  cytoscape: Cytoscape.Cytoscape;
}

/* Convert Graphviz graph to Cytoscape data.
 */
export default function action(params: ActionParams): Promise<ActionResult> {
  const openwhisk = OpenWhisk()
  return openwhisk.actions.invoke({
    name: "data-science-ontology/graphviz",
    blocking: true,
    params: {
      graph: params.graph,
      format: "json0"
    }
  }).then((result) => {
    const graph = JSON.parse(result.response.result.data) as Graphviz.Graph;
    return {
      cytoscape: Cytoscape.dotToCytoscape(graph)
    }
  });
}
global.main = action;
