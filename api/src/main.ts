import express from "express";

import * as Config from "./config";
import * as Methods from "./methods";

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
    Methods.randomConcept().then(body => sendJSON(res, body));
  });

app.get('/annotation/_random',
  (req, res) => {
    Methods.randomAnnotation().then(body => sendJSON(res, body));
  });

app.get('/concept/:id',
  (req, res) => {
    let { id } = req.params;
    Methods.getConcept(id).then(body => sendJSON(res, body));
  });

app.get('/annotation/:lang/:pkg/:id',
  (req, res) => {
    let { lang, pkg, id } = req.params;
    Methods.getAnnotation(lang, pkg, id).then(body => sendJSON(res, body));
  });

app.get('/concepts',
  (req, res) => {
    Methods.listConcepts().then(body => sendJSON(res, body));
  });

app.get('/annotations',
  (req, res) => {
    Methods.listAnnotations().then(body => sendJSON(res, body));
  });

app.get('/counts',
  (req, res) => {
    Methods.counts().then(body => sendJSON(res, body));
  });

app.get('/search/concept/:text',
  (req, res) => {
    let { text } = req.params;
    Methods.searchConcepts(text).then(body => sendJSON(res, body));
  });

app.get('/search/annotation/:text',
  (req, res) => {
    let { text } = req.params;
    Methods.searchAnnotations(text).then(body => sendJSON(res, body));
  });

app.get('/_cache/annotation/:lang/:pkg/:id',
  (req, res) => {
    let { lang, pkg, id } = req.params;
    const _id = `annotation/${lang}/${pkg}/${id}`;
    Methods.getCache(_id).then(body => sendJSON(res, body));
  });

// Start the app!
app.listen(Config.port, () => console.log(
  `Data Science Ontology proxy server listening on port ${Config.port}`));