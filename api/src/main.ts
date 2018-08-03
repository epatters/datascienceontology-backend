import express from "express";

import * as methods from "./methods";

// Environment variables.
const PORT = process.env.PORT || 3000;

// Helper functions.
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
    methods.getConcept(id).then(body => sendJSON(res, body));
  });

app.get('/annotation/:lang/:pkg/:id',
  (req, res) => {
    let { lang, pkg, id } = req.params;
    methods.getAnnotation(lang, pkg, id).then(body => sendJSON(res, body));
  });

app.get('/stats',
  (req, res) => {
    methods.stats().then(body => sendJSON(res, body));
  });

// Start the app!
app.listen(PORT, () => console.log(
  `Data Science Ontology proxy server listening on port ${PORT}`));