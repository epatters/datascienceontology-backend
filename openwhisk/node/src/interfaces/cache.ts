
/** Cached computations for ontology.

  Mirrors the JSON schema for the database.
 */
export interface Cache {
  /* ID of document in database. */
  _id?: string;
  
  /* Schema of document in database (always equal to "cache"). */
  schema?: string;
  
  /* Key for cache entry, typically the ID of another document. */
  key: string;
  
  /* Arbitrary key-value pairs. */
  [keys: string]: any;
} 
