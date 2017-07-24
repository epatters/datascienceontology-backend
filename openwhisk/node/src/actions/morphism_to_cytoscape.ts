import OpenWhisk = require("openwhisk");

import * as Cytoscape from "../cytoscape";
import * as Graphviz from "../graphviz";


interface SExpArray extends Array<string | SExpArray> {}
type SExp = string | SExpArray;

export interface ActionParams {
  /* Morphism expression */
  expr: SExp;
}

export interface ActionResult {
  /* Elements JSON in Cytoscape format. */
  cytoscape: Cytoscape.Cytoscape;
}

/* Convert morphism expression to wiring diagram in Cytoscape format.
 */
export default function action(params: ActionParams): Promise<ActionResult> {
  const generators = getAtoms(params.expr);
  const openwhisk = OpenWhisk();
  return openwhisk.actions.invoke({
    name: "Bluemix_Cloudant_Root/exec-query-find",
    blocking: true,
    params: {
      dbname: "data-science-ontology",
      query: {
        selector: {
          schema: "concept",
          kind: "morphism",
          ontology: "data-science",
          id: { "$in": generators }
        },
        fields: ["_id", "id", "domain", "codomain"],
        limit: generators.length
      }
    }
  }).then((result) => {
    return openwhisk.actions.invoke({
      name: "data-science-ontology/catlab",
      blocking: true,
      params: {
        action: "expression_to_graphviz",
        expr: params.expr,
        generators: result.response.result
      }
    });
  }).then((result) => {
    return openwhisk.actions.invoke({
      name: "data-science-ontology/graphviz_to_cytoscape",
      blocking: true,
      params: {
        graph: result.response.result.data
      }
    });
  }).then((result) => result.response.result);
}
global.main = action;


/* Get the unique atoms (leaves) of an S-expression tree.
 */
function getAtoms(expr: SExp): Array<string> {
  let atoms = new Set<string>();
  const recurse = (expr: SExp) => {
    if (typeof expr === "string") {
      atoms.add(expr);
    } else {
      (expr as SExpArray).slice(1).forEach(recurse);
    }
  }
  return Array.from(atoms);
}
