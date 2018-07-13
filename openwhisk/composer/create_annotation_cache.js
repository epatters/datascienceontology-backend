const cloudant = "Bluemix_Cloudant-discovery_Credentials-lite";

composer.sequence(
  // Read annotation document in DSO database.
  composer.retain(
    composer.sequence(
      params => ({
        docid: params.docid,
        dbname: "data-science-ontology",
      }),
      `${cloudant}/read`
    )
  ),
  ({ params, result }) => Object.assign(params, { annotation: result }),

  // Create Cytoscape graphs for annotation.
  // (This step is independent of previous one and could be run in parallel.)
  composer.retain(
    composer.sequence(
      params => ({ docid: params.docid }),
      "open-discovery/annotation_to_cytoscape"
    )
  ),
  ({ params, result }) => Object.assign(params, { graphs: result }),

  // Create or update annotation document in DSO web application database.
  composer.retain_catch(
    composer.sequence(
      params => ({
        docid: params.docid,
        dbname: "data-science-ontology-webapp",
      }),
      `${cloudant}/read`
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
          { expression: note.definition }, params.graphs),
      },
      dbname: "data-science-ontology-webapp",
    };
  },
  `${cloudant}/write`
)
