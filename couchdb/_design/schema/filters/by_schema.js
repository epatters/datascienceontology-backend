function(doc, req) {
  return doc.schema === req.query.schema;
}
