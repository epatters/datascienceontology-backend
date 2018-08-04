#!/usr/bin/env bash
set -e

DB="data-science-ontology"

echo "Creating database"
ccurl -X DELETE /$DB
ccurl -X PUT /$DB

echo "Pushing design document: schema"
couchapp push _design/schema $DB

echo "Pushing design document: query"
couchapp push _design/query $DB

echo "Pushing design document: search"
couchapp push _design/search $DB
