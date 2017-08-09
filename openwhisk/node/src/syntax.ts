import { SExp, SExpArray } from "./interfaces/expression";
import { Concept, ObjectConcept, MorphismConcept, DomainObject }
  from "./interfaces/concept";

export { SExp, SExpArray };


/** Convert concept to S-expression.
 */
export function conceptToExpr(concept: Concept): SExp {
  if (concept.kind === "object") {
    return objectToExpr(concept as ObjectConcept);
  } else if (concept.kind === "morphism") {
    return morphismToExpr(concept as MorphismConcept);
  }
}

/** Convert object concept to S-expression.
 */
function objectToExpr(concept: ObjectConcept): SExp {
  return ["Ob", concept.id];
}

/** Convert morphism concept to S-expression.
 */
function morphismToExpr(concept: MorphismConcept): SExp {
  return ["Hom", concept.id,
          domainToExpr(concept.domain), domainToExpr(concept.codomain)];
}

function domainToExpr(objs: DomainObject[]): SExp {
  const objectToSExp = (obj: DomainObject): SExp => ["Ob", obj.object];
  if (objs.length === 0) {
    return ["munit"];
  } else if (objs.length == 1) {
    return objectToSExp(objs[0])
  } else {
    return ["otimes", ...objs.map(objectToSExp)];
  }
}
