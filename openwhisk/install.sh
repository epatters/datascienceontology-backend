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

cp "$CATLAB/expression_to_graphviz.jl" "$WORKDIR/exec"
wsk action update $PKG/expression_to_graphviz "$WORKDIR/exec" \
  --docker $DOCKER_USERNAME/whisk-catlab \
  -a description "Convert a morphism S-expression to Graphviz dot format"

wsk action update $PKG/graphviz \
  --docker $DOCKER_USERNAME/whisk-graphviz \
  --param prog dot \
  --param format json0 \
  -a description "Run Graphviz"

wsk action update $PKG/dot_json_to_cytoscape \
  "$NODE/dot_json_to_cytoscape.bundle.js" \
  -a description "Convert Graphviz output (JSON format) to Cytoscape data"

wsk action update $PKG/graphviz_to_cytoscape \
  "$NODE/graphviz_to_cytoscape.bundle.js" \
  -a description "Convert Graphviz input (dot format) to Cytoscape data"

wsk action update $PKG/morphism_to_cytoscape \
  "$NODE/morphism_to_cytoscape.bundle.js" \
  -a description "Convert a morphism expression to Cytoscape data"

wsk action update $PKG/cache_morphism_annotation \
  "$NODE/cache_morphism_annotation.bundle.js" \
  -a description "Create or update the cached data for a morphism annotation"
