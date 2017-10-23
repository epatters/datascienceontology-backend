#!/usr/bin/env bash

PKG="data-science-ontology"
NODE="./node/build"

# Package
#########

wsk package update --shared yes $PKG -a description "Data Science Ontology"

# Actions
#########

wsk action update $PKG/cache_morphism_annotation \
  "$NODE/cache_morphism_annotation.bundle.js" \
  -a description "Create or update the cached data for a morphism annotation"
