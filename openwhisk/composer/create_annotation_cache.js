composer.sequence(
  args => Object.assign(args, {
    dbname: "data-science-ontology",
    /* Work around Composer bug where long-running apps return a session ID
       rather than the actual result. When the bug is fixed the `$blocking`
       argument can be removed.
     */
    $blocking: true,
  }),
  composer.task("Bluemix_Cloudant_Root/read", { output: "note" }),
  composer.task("open-discovery/annotation_to_cytoscape", { output: "graphs" }),
  args => Object.assign(args, {
    dbname: "data-science-ontology-webapp"
  }),
  composer.task(
    composer.try("Bluemix_Cloudant_Root/read", args => {}),
    { output: "doc" }
  ),
  args => ({
    dbname: "data-science-ontology-webapp",
    doc: {
      _id: args.docid,
      _rev: args.doc._rev,
      language: args.note.language,
      package: args.note.package,
      id: args.note.id,
      kind: args.note.kind,
      definition: Object.assign(
        { expression: args.note.definition },
        args.graphs
      )
    }
  }),
  "Bluemix_Cloudant_Root/write"
)
