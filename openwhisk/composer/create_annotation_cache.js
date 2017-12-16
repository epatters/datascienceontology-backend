composer.sequence(
  args => Object.assign(args, {
    dbname: "data-science-ontology",
    /* Work around Composer bug where long-running apps return a session ID
       rather than the actual result. When the bug is fixed the `$blocking`
       argument can be removed.
     */
    $blocking: true,
  }),
  composer.task("open-discovery/annotation_to_cytoscape", { output: "graphs" }),
  composer.task("Bluemix_Cloudant_Root/read", { output: "doc" }),
  args => {
    let doc = args.doc;
    return {
      dbname: "data-science-ontology-webapp",
      doc: {
        _id: doc._id,
        language: doc.language,
        package: doc.package,
        id: doc.id,
        kind: doc.kind,
        definition: Object.assign(
          { expression: doc.definition },
          args.graphs
        )
      }
    };
  },
  "Bluemix_Cloudant_Root/write"
)
