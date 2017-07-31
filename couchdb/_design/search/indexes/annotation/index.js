function(doc) {
  if (doc.schema === "annotation") {
    // If no field specified, search by key, name, and description.
    index("default", [
      doc.language,
      doc.package,
      doc.id,
      doc.name,
      doc.description
    ].join(" "));
    
    index("language", doc.language, {"store": true});
    index("package", doc.package, {"store": true});
    index("id", doc.id, {"store": true});

    index("ontology", doc.ontology, {"store": true});
    index("kind", doc.kind, {"store": true});
    
    if (doc.name) {
      index("name", doc.name);
    }
    if (doc.description) {
      index("description", doc.description);
    }
    
    if (doc.class) {
      index("class", doc.class.join(","), {"store": true});
    }
    if (doc.function) {
      index("function", doc.function, {"store": true});
    }
    if (doc.method) {
      index("method", doc.method, {"store": true});
    }
  }
}
