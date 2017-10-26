composer.sequence(
  args => Object.assign(args, {
    dbname: "data-science-ontology"
  }),
  "Bluemix_Cloudant_Root/read",
  doc => ({
    dbname: "data-science-ontology-webapp",
    doc: {
      _id: doc._id,
      language: doc.language,
      package: doc.package,
      id: doc.id,
      kind: doc.kind,
      definition: {
        expression: doc.definition
      }
    },
  }),
  "Bluemix_Cloudant_Root/write"
)
