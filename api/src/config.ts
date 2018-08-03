// General
export const port = process.env.PORT || 3000;

// CouchDB/Cloudant
export const couchUrl = process.env.COUCH_URL || 'http://localhost:5986';

export const dbName = 'data-science-ontology';
export const dbUrl = `${couchUrl}/${dbName}`;

export const appDbName = 'data-science-ontology-webapp';
export const appDbUrl = `${couchUrl}/${appDbName}`;

// Redis
export const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";