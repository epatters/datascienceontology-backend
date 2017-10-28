#!/usr/bin/env bash

PKG="data-science-ontology"

COMPOSER="./composer"
NODE="./node/build"

# Package
#########

wsk package update --shared yes $PKG -a description "Data Science Ontology"

# Actions
#########

fsh app update $PKG/create_morphism_annotation_cache \
  "$COMPOSER/create_morphism_annotation_cache.js" \
  -a description "Create uninitialized cache entry for morphism annotation"

fsh app update $PKG/update_morphism_annotation_cache \
  "$COMPOSER/update_morphism_annotation_cache.js" \
  -a description "Compute and update cache data for morphism annotation"
