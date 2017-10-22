import { SExp } from "open-discovery";

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
  
  /* Definition of annotated code as concept in ontology. */
  definition: SExp;
}

export type PythonAnnotation = PythonObject | PythonMorphism;

/** Annotation for a Python class.
 */
export interface PythonObject extends Annotation {
  /* Class to which annotation applies. */
  class: string | Array<string>;
  
  /* Class slots (attributes, properties, methods) corresponding to morphisms
     in the ontology.
   */
  slots?: { [slot: string]: string; };
}

/** Annotation for Python function or method.
 */
export interface PythonMorphism extends Annotation {
  /* Fully qualified name of function, if annotating a function. */
  function?: string;
  
  /* Class to which annotation applies, if annotating a method. */
  class?: string | Array<string>;
  
  /* Unqualified name of method, if annotating a method. */
  method?: string;
  
  /* Mapping of arguments (positional and named) to morphism domain/ */
  domain: PythonDomainObject[];
  
  /* Mapping of mutated arguments and return value to morphism codomain. */
  codomain: PythonDomainObject[];
}

/** Object belonging to the domain or codomain of a Python function or method.
 */
export interface PythonDomainObject {
  /* Function slot (argument or return value) */
  slot: number | string;
  
  /* Syntactic name of domain object */
  name?: string;
  
  /* Human-readable description of domain object */
  description?: string;
}
