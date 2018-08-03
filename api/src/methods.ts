import request from "request-promise-native";

// Constants and environment variables.
const COUCH_URL = process.env.COUCH_URL || 'http://localhost:5986';
const ONTOLOGY_DB = 'data-science-ontology';
const ONTOLOGY_DB_URL = `${COUCH_URL}/${ONTOLOGY_DB}`;
const WEBAPP_DB = 'data-science-ontology-webapp';
const WEBAPP_DB_URL = `${COUCH_URL}/${WEBAPP_DB}`;

// Generic CouchDB/Cloudant 

function get(_id: string) {
  return request(`${ONTOLOGY_DB_URL}/${encodeURIComponent(_id)}`);
}

function view(ddoc: string, view: string, params?: object) {
  return request({
    url: `${ONTOLOGY_DB_URL}/_design/${ddoc}/_view/${view}`,
    qs: params,
  });
}

// API methods

export function getConcept(id: string) {
  return get(`concept/${id}`);
}
export function getAnnotation(lang: string, pkg: string, id: string) {
  return get(`annotation/${lang}/${pkg}/${id}`);
}

export function stats() {
  return view("query", "schema_index", {
    group: true,
    reduce: true,
  })
  .then(body => {
    const result = JSON.parse(body) as {
      rows: { key: string[], value: number }[],
    };
    const table = result.rows.reduce((table: {[key: string]: number}, row) => {
      table[row.key[0]] = row.value;
      return table;
    }, {});
    return JSON.stringify(table);
  });
}