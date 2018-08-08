import * as _ from "lodash";
import request from "request-promise-native";

import * as Config from "./config";

// Generic CouchDB/Cloudant 

function get(_id: string) {
  return request(`${Config.dbUrl}/${encodeURIComponent(_id)}`);
}

function view(ddoc: string, view: string, params?: object) {
  return request({
    url: `${Config.dbUrl}/_design/${ddoc}/_view/${view}`,
    qs: params,
  });
}

function find(options: object) {
  return request({
    url: `${Config.dbUrl}/_find`,
    method: 'POST',
    json: true,
    body: options,
  }).then(result => result.docs as any[]);
}

function search(ddoc: string, index: string, options: object) {
  return request({
    url: `${Config.dbUrl}/_design/${ddoc}/_search/${index}`,
    method: 'POST',
    json: true,
    body: options,
  }).then(result => {
    let rows = result.rows as { id: string, fields: object }[];
    return rows.map(row => _.assign({_id: row.id}, row.fields));
  });
}

// API methods

export function getConcept(id: string) {
  return get(`concept/${id}`);
}

export function getAnnotation(lang: string, pkg: string, id: string) {
  return get(`annotation/${lang}/${pkg}/${id}`);
}

export function getCache(_id: string) {
  return request(`${Config.appDbUrl}/${encodeURIComponent(_id)}`);
}

interface ListConceptsOptions {
  short?: boolean;
}
export function listConcepts(options: ListConceptsOptions = {}) {
  return find({
    selector: {
      schema: 'concept',
    },
    fields: !options.short ? undefined : [
      '_id', 'id', 'name', 'kind',
    ],
  });
}

interface ListAnnotationsOptions {
  short?: boolean;
  language?: string;
  package?: string;
}
export function listAnnotations(options: ListAnnotationsOptions = {}) {
  return find({
    selector: {
      schema: 'annotation',
      language: options.language,
      package: options.package,
    },
    fields: !options.short ? undefined : [
      '_id', 'language', 'package', 'id', 'name', 'kind',
    ],
  });
}

export function randomConcept() {
  return countsJSON().then(counts => {
    const nconcepts = counts.concept;
    return find({
      selector: { schema: 'concept' },
      limit: 1,
      skip: _.random(nconcepts),
    }).then(docs => docs[0]);
  });
}

export function randomAnnotation() {
  return countsJSON().then(counts => {
    const nannations = counts.annotation;
    return find({
      selector: { schema: 'annotation' },
      limit: 1,
      skip: _.random(nannations),
    }).then(docs => docs[0]);
  });
}

export function searchConcepts(text: string) {
  const query = [
    `id:(${text})^100`,      // Exact match on ID due to `keyword` analyzer
    `name:(${text})^3`,      // Inexact match on name
    `description:(${text})`, // Inexact match on description
  ].join(' ');
  return search('search', 'concept', { query });
}

export function searchAnnotations(text: string) {
  const query = [
    `language:(${text})`, `package:(${text})^3`, `id:(${text})^100`,
    `name:(${text})^3`, `description:(${text})`,
    `class:(${text})`, `function:(${text})`, `method:(${text})`
  ].join(' ');
  return search('search', 'annotation', { query });
}

export function counts() {
  return countsJSON().then(result => JSON.stringify(result));
}
function countsJSON(): Promise<{[key: string]: number}> {
  return view('query', 'schema_index', {
    group: true,
    reduce: true,
  }).then(body => {
    const result = JSON.parse(body) as {
      rows: { key: string[], value: number }[],
    };
    return _.chain(result.rows)
      .keyBy(row => row.key[0])
      .mapValues(row => row.value)
      .value();
  });
}