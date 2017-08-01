function(doc) {
  if (doc.schema === "concept") {
    index("ontology", doc.ontology, {"store": true});
    index("id", doc.id, {"store": true});
    index("kind", doc.kind, {"store": true});
    
    index("name", doc.name, {"store": true});
    if (doc.description) {
      index("description", doc.description, {"store": true});
    }
  }
}
