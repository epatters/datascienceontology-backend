import { SExp, SExpArray } from "./interfaces/expression";
import { MorphismConcept, DomainObject } from "./interfaces/concept";

export { SExp, SExpArray };


/** Convert morphism to S-expression.
 */
export function morphismToExpr(concept: MorphismConcept): SExp {
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
