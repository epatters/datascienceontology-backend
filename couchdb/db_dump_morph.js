module.exports = function(doc, cb) {
  if (doc._id.startsWith("_design/")) {
    // Omit design documents since they contain large JS blobs.
    return cb();
  }
  if (doc._id.startsWith("cache/")) {
    // Omit transient "cache" documents.
    return cb();
  }
  return cb(null, doc);
}
