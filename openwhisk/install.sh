#!/usr/bin/env bash

PKG="data-science-ontology"
CLOUDANT_PKG="Bluemix_Cloudant_Root"
CLOUDANT_DBNAME="data-science-ontology"

DOCKER_USERNAME="epatters"
CATLAB="./catlab/src"
NODE="./node/build"

# Package
#########

wsk package update --shared yes $PKG -a description "Data Science Ontology"

# Actions
#########

WORKDIR=$(mktemp -d)

cp "$CATLAB/annotation_to_graphviz.jl" "$WORKDIR/exec"
wsk action update $PKG/annotation_to_graphviz "$WORKDIR/exec" \
  --docker $DOCKER_USERNAME/whisk-catlab \
  -a description "Convert morphism annotation to Graphviz dot format"

cp "$CATLAB/morphism_to_graphviz.jl" "$WORKDIR/exec"
wsk action update $PKG/morphism_to_graphviz "$WORKDIR/exec" \
  --docker $DOCKER_USERNAME/whisk-catlab \
  -a description "Convert morphism S-expression to Graphviz dot format"

wsk action update $PKG/cache_morphism_annotation \
  "$NODE/cache_morphism_annotation.bundle.js" \
  -a description "Create or update the cached data for a morphism annotation"
