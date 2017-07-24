module.exports = function(doc, cb) {
  if (doc._id.startsWith("_design/")) {
    // Omit design documents since they contain large JS blobs.
    return cb();
  }
  return cb(null, doc);
}
