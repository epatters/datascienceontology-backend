#!/usr/bin/env bash

PKG="data-science-ontology"

COMPOSER="./composer"
NODE="./node/build"

# Package
#########

wsk package update --shared yes $PKG -a description "Data Science Ontology"

# Actions
#########

fsh app update $PKG/create_annotation_cache \
  "$COMPOSER/create_annotation_cache.js" \
  -a description "Create or update cache data for morphism annotation"
