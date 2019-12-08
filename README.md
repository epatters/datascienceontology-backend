# Backend for Data Science Ontology

This repository contains the web backend for the Data Science Ontology,
consisting of:
- REST API, implemented using an Express.js proxy server
- CouchDB (or Cloudant) database
- Actions for Apache OpenWhisk (or IBM Cloud Functions)

The Data Science Ontology itself lives in its own
[repository](https://github.com/ibm/datascienceontology).

## Developer documentation

### Pushing the design docs to CouchDB

Ensure a CouchDB instance is available and `COUCH_URL` and `IAM_API_KEY`
are properly set. See the `datascienceontology` README for details.

Ensure CouchApp is installed. On Fedora:

    sudo dnf install python2-devel
    pip2 install --user couchapp

To install the JavaScript-based dependencies: `cd couchdb && npm install`

To start the CouchDB proxy, which needs to keep running for authentication
while pushing the design docs:
`cd couchdb && npm run proxy`

To push the design docs: `cd couchdb && ./install.sh`
