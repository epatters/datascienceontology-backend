import Express from "express";
import ExpressRedisCache from "express-redis-cache";
import Cors from "cors";
import Redis from "redis";

import * as Config from "./config";
import * as Methods from "./methods";

// Helper functions.

const sendJSON = (res: Express.Response, data: object | string) => {
  if (typeof data === 'object')
    data = JSON.stringify(data);
  res.set('Content-Type', 'application/json');
  res.send(data);
}

const handleGetError = (res: Express.Response, next: Express.NextFunction, error: any) => {
  if (error.statusCode == 404) {
    res.status(404);
    sendJSON(res, { error: 'not_found' });
  } else {
    next();
  }
}

// Create Express.js app.

const app = Express();
app.use(Cors(Config.cors));

// Set up Redis caching on all routes.

const redis = Redis.createClient(Config.redisUrl);
const cache = ExpressRedisCache({
  client: redis,
  prefix: 'dso',
  expire: {
    // Cache successful requests for one day.
    200: 60*60*24,
    // Don't cache failed requests.
    // FIXME: Should be 0, not 1, but that's not yet supported, see:
    // https://github.com/rv-kip/express-redis-cache/pull/93
    xxx: 1,
  } as any,
})
app.use(cache.route());

// Define routes for REST API.

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
  (req, res, next) => {
    let { id } = req.params;
    Methods.getConcept(id)
      .then(body => sendJSON(res, body))
      .catch(error => handleGetError(res, next, error));
  });

app.get('/annotation/:lang/:pkg/:id',
  (req, res, next) => {
    let { lang, pkg, id } = req.params;
    Methods.getAnnotation(lang, pkg, id)
      .then(body => sendJSON(res, body))
      .catch(error => handleGetError(res, next, error));
  });

app.get('/concepts',
  (req, res) => {
    Methods.listConcepts({
      short: req.query.short === "true",
    }).then(body => sendJSON(res, body));
  });

app.get('/annotations',
  (req, res) => {
    Methods.listAnnotations({
      short: req.query.short === "true",
    }).then(body => sendJSON(res, body));
  });

app.get('/annotations/:lang',
  (req, res) => {
    Methods.listAnnotations({
      short: req.query.short === "true",
      language: req.params.lang,
    }).then(body => sendJSON(res, body));
  });

app.get('/annotations/:lang/:pkg',
  (req, res) => {
    Methods.listAnnotations({
      short: req.query.short === "true",
      language: req.params.lang,
      package: req.params.pkg,
    }).then(body => sendJSON(res, body));
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
  (req, res, next) => {
    let { lang, pkg, id } = req.params;
    const _id = `annotation/${lang}/${pkg}/${id}`;
    Methods.getCache(_id)
      .then(body => sendJSON(res, body))
      .catch(error => handleGetError(res, next, error));
  });

// Start the app!

app.listen(Config.port, () => console.log(
  `Data Science Ontology proxy server listening on port ${Config.port}`));