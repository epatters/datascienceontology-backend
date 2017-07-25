/** Concept in an ontology.

  Mirrors the JSON schema for the database.
 */
export type Concept = ObjectConcept | MorphismConcept;

/** Object concept in an ontology.
 */
export interface ObjectConcept extends ConceptBase {
  /* Concept is a subobject (subtype) of these objects, if it is an object */
  subobject?: string[];
}

/** Morphism concept in an ontology.
 */
export interface MorphismConcept extends ConceptBase {
  /* Domain and codomain of concept, if it is a morphism */
  domain: Array<DomainObject>;
  codomain: Array<DomainObject>;
  
  /* Identifer of generic morphism to which this concept belongs, if it is a concept */
  generic?: string;
}

/** Base interface for concept in an ontology.
 */
interface ConceptBase {
  /* ID of document in database. */
  _id?: string;
  
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
  definition?: any;
}

/** Object belonging to the domain or codomain of a morphism.
 */
interface DomainObject {
  /* ID of an object concept */
  object: string;
  
  /* Syntactic name of domain object */
  name?: string;
  
  /* Human-readable description of domain object */
  description?: string;
}
