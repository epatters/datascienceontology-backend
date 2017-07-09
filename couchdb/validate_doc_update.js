function(newDoc, oldDoc, userCtx) {
  // Don't validate documents that are being deleted.
  if (newDoc._deleted) {
    return;
  }
  
  // Check for schema in document and database.
  if (!newDoc.schema) {
    throw({forbidden : 'Document schema is missing'});
  }
  if (!this.schema.hasOwnProperty(newDoc.schema)) {
    throw({forbidden : 'Database has no schema for: ' + newDoc.schema});
  }
  var schema = this.schema[newDoc.schema];
  
  // Validate schema.
  var Ajv = require('lib/ajv');
  var ajv = new Ajv({format: 'full', allErrors: true});
  if (!ajv.validate(schema, newDoc)) {
    throw({forbidden: 'Document validation error: ' + ajv.errorsText()});
  }
  
  // Validate ID.
  var _id = schema.documentID.map(function(property) {
    return newDoc[property];
  }).join('/');
  if (newDoc._id !== _id) {
    throw({forbidden: 'Document ID must equal: ' + _id});
  }
}
