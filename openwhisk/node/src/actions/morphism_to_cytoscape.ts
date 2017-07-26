import OpenWhisk = require("openwhisk");

import { SExp, SExpArray, morphismToExpr } from "../syntax";
import { MorphismConcept } from "../interfaces/concept";
import * as Cytoscape from "../interfaces/cytoscape";
import * as Graphviz from "../interfaces/graphviz";


export interface ActionParams {
  /* Morphism expression */
  expression: SExp;
}

export interface ActionResult {
  /* Elements JSON in Cytoscape format. */
  cytoscape: Cytoscape.Cytoscape;
}

/* Convert morphism expression to wiring diagram in Cytoscape format.
 */
export default function action(params: ActionParams): Promise<ActionResult> {
  const generators = getAtoms(params.expression);
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
    const docs = result.response.result.docs;
    const expression = expandGenerators(params.expression, docs);
    return openwhisk.actions.invoke({
      name: "data-science-ontology/catlab",
      blocking: true,
      params: {
        action: "expression_to_graphviz",
        expression: expression
      }
    });
  }).then((result) => {
    return openwhisk.actions.invoke({
      name: "data-science-ontology/graphviz_to_cytoscape",
      blocking: true,
      params: {
        graph: result.response.result.data,
        edgeEndPoints: true
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
  recurse(expr);
  return Array.from(atoms);
}

/* Expand generator names into generator constructors.

  Uses generator definitions from the ontology.
 */
function expandGenerators(expr: SExp, generators: Array<MorphismConcept>): SExp {
  let expansions: { [id: string]: SExp } = {};
  for (let concept of generators) {
    expansions[concept.id] = morphismToExpr(concept);
  }
  const recurse = (expr: SExp): SExp => {
    if (typeof expr === "string") {
      return expansions[expr];
    } else {
      return (expr as SExpArray).map(recurse);
    }
  }
  return recurse(expr);
}
