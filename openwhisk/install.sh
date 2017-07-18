#!/usr/bin/env bash

PKG="data-science-ontology"
NODE="./node/build"

wsk package update --shared yes $PKG -a description "Data Science Ontology"

wsk action update --web true "$PKG/graphviz_to_cytoscape" \
  "$NODE/graphviz_to_cytoscape.bundle.js" \
  -a description "Convert Graphviz output to Cytoscape data"
