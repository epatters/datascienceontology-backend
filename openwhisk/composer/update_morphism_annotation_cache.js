composer.sequence(
  args => Object.assign(args, {
    dbname: "data-science-ontology-webapp",
    /* Work around Composer bug where long-running apps return a session ID
       rather than the actual result. When the bug is fixed the `$blocking`
       argument can be removed.
     */
    $blocking: true,
  }),
  composer.task("Bluemix_Cloudant_Root/read", { output: "doc" }),
  composer.task("open-discovery/annotation_to_cytoscape", { output: "graphs" }),
  args => {
    Object.assign(args.doc.definition, args.graphs);
    return {
      doc: args.doc,
      dbname: args.dbname,
    };
  },
  "Bluemix_Cloudant_Root/write"
)
