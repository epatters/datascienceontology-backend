const composer = require('openwhisk-composer')

module.exports = composer.sequence(
  // Get all documents for which the frontend expects cache data.
  composer.retain(
    params => ({
      dbname: "data-science-ontology",
      query: {
        selector: {
          schema: "annotation",
          kind: "function",
        },
        fields: [ "_id" ],
      }
    }),
    "cloudant/exec-query-find",
    params => ({ needed: params.docs.map(doc => doc._id) }),
  ),
  ({ params, result }) => Object.assign(params, result),
  
  // Get all documents that have cache data.
  // (This step is independent of previous one and could be run in parallel.)
  composer.retain(
    params => ({ dbname: "data-science-ontology-webapp" }),
    "cloudant/list-documents",
    params => ({ cached: params.rows.map(row => row.key) }),
  ),
  ({ params, result }) => Object.assign(params, result),

  // Take the set difference.
  params => {
    const _ = require("lodash");
    return { missing: _.difference(params.needed, params.cached) };
  }
)