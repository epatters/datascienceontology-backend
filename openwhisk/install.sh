#!/usr/bin/env bash

PKG="data-science-ontology"

DOCKER="epatters"
NODE="./node/build"

wsk package update --shared yes $PKG -a description "Data Science Ontology"

wsk action update $PKG/catlab \
  --docker $DOCKER/whisk-catlab \
  -a description "Run a subaction in Catlab"

wsk action update $PKG/graphviz \
  --docker $DOCKER/whisk-graphviz \
  --param prog dot \
  --param format json0 \
  -a description "Run Graphviz"

wsk action update $PKG/dot_json_to_cytoscape \
  "$NODE/dot_json_to_cytoscape.bundle.js" \
  -a description "Convert Graphviz output (JSON format) to Cytoscape data"

wsk action update $PKG/graphviz_to_cytoscape \
  "$NODE/graphviz_to_cytoscape.bundle.js" \
  -a description "Convert Graphviz input (dot format) to Cytoscape data"

wsk action update $PKG/expression_to_cytoscape \
  "$NODE/expression_to_cytoscape.bundle.js" \
  -a description "Convert a morphism expression to Cytoscape data"
