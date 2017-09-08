import * as _ from "lodash";
import OpenWhisk = require("openwhisk");

import { SExp, SExpArray, conceptToExpr } from "../syntax";
import { Concept } from "../interfaces/concept";
import * as Cytoscape from "../interfaces/cytoscape";
import * as Graphviz from "../interfaces/graphviz";


export interface ActionParams {
  /* Morphism expression */
  expression: SExp;
}

export interface ActionResult {
  /* Graphviz output in JSON format. */
  graphviz: Graphviz.Graph;
  
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
          ontology: "data-science",
          id: { "$in": generators }
        },
        fields: ["_id", "id", "kind", "domain", "codomain"],
        limit: generators.length
      }
    }
  }).then((result) => {
    const docs = result.response.result.docs;
    let expression: SExp;
    try {
      expression = expandGenerators(params.expression, docs);
    } catch (error) {
      return { error: error.message };
    }
    return openwhisk.actions.invoke({
      name: "data-science-ontology/expression_to_graphviz",
      blocking: true,
      params: {
        expression: expression,
        labels: true,
        xlabel: true,
        graph_attrs: {
          fontname: "Helvetica",
          fontsize: "12"
        },
        node_attrs: {
          fontname: "Helvetica",
          fontsize: "12"
        },
        edge_attrs: {
          fontname: "Helvetica",
          fontsize: "12",
          arrowhead: "none"
        }
      }
    }).then((result) => {
      return openwhisk.actions.invoke({
        name: "data-science-ontology/graphviz_to_cytoscape",
        blocking: true,
        params: {
          graph: result.response.result.data,
          edgeEndPoints: true,
          controlPoints: true
        }
      })
    }).then((result) => result.response.result);
  });
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
function expandGenerators(expr: SExp, generators: Array<Concept>): SExp {
  let expansions: { [id: string]: SExp } = {};
  for (let concept of generators) {
    expansions[concept.id] = conceptToExpr(concept);
  }
  const recurse = (expr: SExp): SExp => {
    if (typeof expr === "string") {
      if (_.has(expansions, expr)) {
        return expansions[expr];
      } else {
        throw new Error(`Unknown generator '${expr}'`);
      }
    } else {
      const sexp = expr as SExpArray;
      const [head, args] = [sexp[0], sexp.slice(1)];
      return [head].concat(args.map(recurse));
    }
  }
  return recurse(expr);
}
