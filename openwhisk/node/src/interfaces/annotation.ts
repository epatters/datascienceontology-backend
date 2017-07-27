import { SExp } from "./expression";

/** Annotation in an ontology.

  Mirrors the JSON schema for the database.
*/
export interface Annotation {
  /* ID of document in database. */
  _id?: string;
  
  /* Schema of document in database (always equal to "annotation"). */
  schema?: string;
  
  /* Programming language of annotated code. */
  language: string;
  
  /* Library or package of annotated code. */
  package: string;
  
  /* Identifer for annotation, unique within language and package. */
  id: string;
  
  /* Human-readable name of annotated code object. */
  name?: string;
  
  /* Human-readable description of annotated code object. */
  description?: string;
  
  /* Ontology to which the annotation refers. */
  ontology: string;
  
  /* Kind of concept in ontology: "object" or "morphism". */
  kind: string;
  
  /* Definition of annotated code as concept in ontology. */
  definition: SExp;
}
