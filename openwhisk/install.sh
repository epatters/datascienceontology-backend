#!/usr/bin/env bash

PKG="data-science-ontology"

COMPOSER="./composer"
JULIA="./julia/src"
JULIA_TIMEOUT="300000" # milliseconds

JULIA_DOCKER="epatters/whisk-catlab:julia1.2"

# Package
#########

ibmcloud wsk package update --shared yes $PKG -a description "Data Science Ontology"

# Actions
#########

WORKDIR=$(mktemp -d)

kui wsk app update $PKG/build_cytoscape_figure \
  "$COMPOSER/build_cytoscape_figure.js" \
  -a description "Build Cytoscape graph for morphism figure in documentation"

kui wsk app update $PKG/create_missing_cache \
  "$COMPOSER/create_missing_cache.js" \
  -a description "Create cache data for all concepts and annotations missing it"

kui wsk app update $PKG/list_missing_cache \
  "$COMPOSER/list_missing_cache.js" \
  -a description "List concepts and annotations with missing cache data"

kui wsk app update $PKG/update_annotation_cache \
  "$COMPOSER/update_annotation_cache.js" \
  -a description "Create or update cache data for morphism annotation"

kui wsk app update $PKG/concept_map_as_cytoscape \
  "$COMPOSER/concept_map_as_cytoscape.js" \
  -a description "Create concept map as Cytoscape data"

cp "$JULIA/concept_map_as_graphviz.jl" "$WORKDIR/exec"
ibmcloud wsk action update $PKG/concept_map_as_graphviz "$WORKDIR/exec" \
  --docker $JULIA_DOCKER --timeout $JULIA_TIMEOUT \
  -a description "Crate concept map as Graphviz neato graph"
