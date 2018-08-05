#!/usr/bin/env bash

PKG="data-science-ontology"
COMPOSER="./composer"

# Package
#########

ibmcloud wsk package update --shared yes $PKG -a description "Data Science Ontology"

# Actions
#########

fsh app update $PKG/build_cytoscape_figure \
  "$COMPOSER/build_cytoscape_figure.js" \
  -a description "Build Cytoscape graph for morphism figure in documentation"

fsh app update $PKG/create_missing_cache \
  "$COMPOSER/create_missing_cache.js" \
  -a description "Create cache data for all concepts and annotations missing it"

fsh app update $PKG/list_missing_cache \
  "$COMPOSER/list_missing_cache.js" \
  -a description "List concepts and annotations with missing cache data"

fsh app update $PKG/update_annotation_cache \
  "$COMPOSER/update_annotation_cache.js" \
  -a description "Create or update cache data for morphism annotation"
