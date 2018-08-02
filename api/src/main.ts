import express from "express";
import request from "request-promise-native";

// Environment variables.
const PORT = process.env.PORT || 3000;
const COUCH_URL = process.env.COUCH_URL || 'http://localhost:5986';
const ONTOLOGY_DB = 'data-science-ontology';
const WEBAPP_DB = 'data-science-ontology-webapp';

// Helper functions.
const ontologyDB = {
  get: (_id: string) => `${COUCH_URL}/${ONTOLOGY_DB}/${encodeURIComponent(_id)}`
}

const sendJSON = (res: express.Response, data: string) => {
  res.set('Content-Type', 'application/json');
  res.send(data);
}

// Create and set up Express.js app.
const app = express();

app.get('/', (req, res) => res.send('Data Science Ontology API'));

app.get('/concept/:id',
  (req, res) => {
    let { id } = req.params;
    const _id = `concept/${id}`;
    request(ontologyDB.get(_id))
      .then(body => sendJSON(res, body));
  });

app.get('/annotation/:lang/:pkg/:id',
  (req, res) => {
    let { lang, pkg, id } = req.params;
    const _id = `annotation/${lang}/${pkg}/${id}`;
    request(ontologyDB.get(_id))
      .then(body => sendJSON(res, body));
  });

// Start the app!
app.listen(PORT, () => console.log(
  `Data Science Ontology proxy server listening on port ${PORT}`));