import request from "request-promise-native";

// Environment variables.
const COUCH_URL = process.env.COUCH_URL || 'http://localhost:5986';
const ONTOLOGY_DB = 'data-science-ontology';
const WEBAPP_DB = 'data-science-ontology-webapp';


function get(_id: string) {
  return request(`${COUCH_URL}/${ONTOLOGY_DB}/${encodeURIComponent(_id)}`);
}
export function getConcept(id: string) {
  return get(`concept/${id}`);
}
export function getAnnotation(lang: string, pkg: string, id: string) {
  return get(`annotation/${lang}/${pkg}/${id}`);
}