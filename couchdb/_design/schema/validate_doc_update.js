function(newDoc, oldDoc, userCtx) {
  // Don't validate documents that are being deleted.
  if (newDoc._deleted) {
    return;
  }
  
  // Check for schema in document and database.
  if (!newDoc.schema) {
    throw({forbidden : 'Document schema is missing'});
  }
  if (!this.schemas.hasOwnProperty(newDoc.schema)) {
    throw({forbidden : 'Database has no schema: ' + newDoc.schema});
  }
  var schema = this.schemas[newDoc.schema];
  
  // Validate schema.
  var tv4 = require('lib/tv4');
  try {
    var result = tv4.validateResult(newDoc, schema);
  } catch (exc) {
    throw({forbidden: 'Error validating document: ' + JSON.stringify(exc)});
  }
  if (!result.valid) {
    throw({forbidden: 'Document invalid: ' + result.error.message});
  }
  
  // Validate ID.
  var _id = schema.documentID.map(function(property) {
    return newDoc[property];
  }).join('/');
  if (newDoc._id !== _id) {
    throw({forbidden: 'Document ID must equal: ' + _id});
  }
}
