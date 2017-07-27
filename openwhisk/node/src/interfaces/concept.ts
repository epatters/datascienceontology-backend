import { SExp } from "./expression";

/** Concept in an ontology.

  Mirrors the JSON schema for the database.
 */
export type Concept = ObjectConcept | MorphismConcept;

/** Object concept in an ontology.
 */
export interface ObjectConcept extends ConceptBase {}

/** Morphism concept in an ontology.
 */
export interface MorphismConcept extends ConceptBase {
  /* Domain and codomain of morphism */
  domain: Array<DomainObject>;
  codomain: Array<DomainObject>;
}

/** Base interface for concept in an ontology.
 */
interface ConceptBase {
  /* ID of document in database. */
  _id?: string;
  
  /* Schema of document in database (always equal to "concept"). */
  schema?: string;
  
  /* Ontology to which concept belongs. */
  ontology?: string;
  
  /* ID for concept, unique within ontology */
  id: string;
  
  /* Human-readable name of concept */
  name: string;
  
  /* Human-readable description of concept in Markdown */
  description?: string;
  
  /* Kind of concept: "object" or "morphism" */
  kind: string;
  
  /* Definition of concept in terms of other concepts */
  definition?: SExp;
  
  /* Concept is a sub-concept (subobject/subtype or sub-morphism) of these concepts */
  subconcept?: string[];
}

/** Object belonging to the domain or codomain of a morphism.
 */
export interface DomainObject {
  /* ID of an object concept */
  object: string;
  
  /* Syntactic name of domain object */
  name?: string;
  
  /* Human-readable description of domain object */
  description?: string;
}
