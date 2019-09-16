const composer = require('openwhisk-composer')

module.exports = composer.sequence(
  // Read annotation document in DSO database.
  composer.retain(
    composer.sequence(
      params => ({
        docid: params.docid,
        dbname: "data-science-ontology",
      }),
      "cloudant/read"
    )
  ),
  ({ params, result }) => Object.assign(params, { annotation: result }),

  // Generate Graphviz layout for annotation.
  // (This step is independent of previous one and could be run in parallel.)
  composer.retain(
    composer.sequence(
      params => ({ docid: params.docid }),
      "open-discovery/annotation_to_graphviz_json"
    )
  ),
  ({ params, result }) => Object.assign(params, { layout: result }),

  // Create or update annotation document in DSO web application database.
  composer.retain_catch(
    composer.sequence(
      params => ({
        docid: params.docid,
        dbname: "data-science-ontology-webapp",
      }),
      "cloudant/read"
    )
  ),
  ({ params, result }) => {
    let doc = result;
    let note = params.annotation;
    return {
      doc: {
        _id: params.docid,
        _rev: doc._rev,
        language: note.language,
        package: note.package,
        id: note.id,
        kind: note.kind,
        definition: Object.assign(
          { expression: note.definition }, params.layout),
      },
      dbname: "data-science-ontology-webapp",
    };
  },
  "cloudant/write"
)
