#!/usr/bin/env bash
set -e

COUCHAPP="data-science-ontology"

pushd() { builtin pushd "$@" > /dev/null; }
popd() { builtin pushd "$@" > /dev/null; }

echo "Pushing design document: schema"
pushd _design/schema
couchapp push $COUCHAPP
popd

echo "Pushing design document: search"
pushd _design/search
couchapp push $COUCHAPP
popd

echo "Creating bulk data"
jq '{docs: .}' ../../ontology.json |
  ccurl -X POST -d @- /data-science-ontology/_bulk_docs |
  jq '.'
