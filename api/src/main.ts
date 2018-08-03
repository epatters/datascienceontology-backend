import express from "express";

import * as methods from "./methods";

// Environment variables.
const PORT = process.env.PORT || 3000;

// Helper functions.
const sendJSON = (res: express.Response, data: object | string) => {
  if (typeof data === 'object')
    data = JSON.stringify(data);
  res.set('Content-Type', 'application/json');
  res.send(data);
}

// Create and set up Express.js app.
const app = express();

app.get('/', (req, res) => res.send('Data Science Ontology API'));

app.get('/concept/_random',
  (req, res) => {
    methods.randomConcept().then(body => sendJSON(res, body));
  });

app.get('/annotation/_random',
  (req, res) => {
    methods.randomAnnotation().then(body => sendJSON(res, body));
  });

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

app.get('/concepts',
  (req, res) => {
    methods.listConcepts().then(body => sendJSON(res, body));
  });

app.get('/annotations',
  (req, res) => {
    methods.listAnnotations().then(body => sendJSON(res, body));
  });

app.get('/counts',
  (req, res) => {
    methods.counts().then(body => sendJSON(res, body));
  });

app.get('/search/concept/:text',
  (req, res) => {
    let { text } = req.params;
    methods.searchConcepts(text).then(body => sendJSON(res, body));
  });

app.get('/search/annotation/:text',
  (req, res) => {
    let { text } = req.params;
    methods.searchAnnotations(text).then(body => sendJSON(res, body));
  });

// Start the app!
app.listen(PORT, () => console.log(
  `Data Science Ontology proxy server listening on port ${PORT}`));