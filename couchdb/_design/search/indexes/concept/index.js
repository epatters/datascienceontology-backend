function(doc) {
  if (doc.schema === "concept") {
    index("id", doc.id);
    if (doc.name) {
      index("name", doc.name, {"store": true});
    }
    if (doc.description) {
      index("description", doc.description);
    }
  }
}
