import { SExp } from "./expression";

/** Code annotation for an ontology.

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
}

export type PythonAnnotation = PythonObject | PythonMorphism;

/** Annotation for a Python class.
 */
export interface PythonObject extends Annotation {
  /* Class to which annotation applies. */
  class: Array<string>;
  
  /* Definition of annotated class as object in ontology. */
  definition: string;
}

/** Annotation for Python function or method.
 */
export interface PythonMorphism extends Annotation {
  /* Fully qualified name of function, if annotating a function. */
  function?: string;
  
  /* Class to which annotation applies, if annotating a method. */
  class?: Array<string>;
  
  /* Unqualified name of method. */
  method?: string;
  
  /* Definition of annotated function or method as morphism in ontology. */
  definition: SExp;
  
  /* Mapping of arguments (positional and named) to morphism domain/ */
  domain: Array<number | string>;
  
  /* Mapping of mutated arguments and return value to morphism codomain. */
  codomain: Array<number | string>;
}
