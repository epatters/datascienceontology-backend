function(doc) {
  if (doc.schema === "concept") {
    // If no field specified, search concept ID, name, and description.
    index("default", [doc.id, doc.name, doc.description].join(" "));
    
    index("ontology", doc.ontology, {"store": true});
    index("id", doc.id, {"store": true});
    index("name", doc.name, {"store": true});
    if (doc.description) {
      index("description", doc.description, {"store": true});
    }
  }
}
