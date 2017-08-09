function(doc) {
  if (doc.schema === "annotation") {
    index("language", doc.language, {"store": true});
    index("package", doc.package, {"store": true});
    index("id", doc.id, {"store": true});

    index("ontology", doc.ontology, {"store": true});
    index("kind", doc.kind, {"store": true});
    
    if (doc.name) {
      index("name", doc.name, {"store": true});
    }
    if (doc.description) {
      index("description", doc.description, {"store": true});
    }
    
    if (doc.class) {
      if (typeof doc.class === "string") {
        index("class", doc.class)
      } else {
        index("class", doc.class.join(","));
      }
    }
    if (doc.function) {
      index("function", doc.function);
    }
    if (doc.method) {
      index("method", doc.method);
    }
  }
}
