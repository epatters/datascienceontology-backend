#!/usr/bin/env bash
set -e

COUCHAPP="data-science-ontology"

pushd() { builtin pushd "$@" > /dev/null; }
popd() { builtin pushd "$@" > /dev/null; }

echo "Pushing design document: schema"
pushd _design/schema
couchapp push $COUCHAPP
popd

echo "Pushing design document: query"
pushd _design/query
couchapp push $COUCHAPP
popd

echo "Pushing design document: search"
pushd _design/search
couchapp push $COUCHAPP
popd
