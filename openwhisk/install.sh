#!/usr/bin/env bash

PKG="data-science-ontology"
CLOUDANT_PKG="Bluemix_Cloudant_Root"
CLOUDANT_DBNAME="data-science-ontology"

DOCKER="epatters"
NODE="./node/build"

# Package
#########

wsk package create --shared yes $PKG -a description "Data Science Ontology"

# Actions
#########

wsk action create $PKG/catlab \
  --docker $DOCKER/whisk-catlab \
  -a description "Run a subaction in Catlab"

wsk action create $PKG/graphviz \
  --docker $DOCKER/whisk-graphviz \
  --param prog dot \
  --param format json0 \
  -a description "Run Graphviz"

wsk action create $PKG/dot_json_to_cytoscape \
  "$NODE/dot_json_to_cytoscape.bundle.js" \
  -a description "Convert Graphviz output (JSON format) to Cytoscape data"

wsk action create $PKG/graphviz_to_cytoscape \
  "$NODE/graphviz_to_cytoscape.bundle.js" \
  -a description "Convert Graphviz input (dot format) to Cytoscape data"

wsk action create $PKG/morphism_to_cytoscape \
  "$NODE/morphism_to_cytoscape.bundle.js" \
  -a description "Convert a morphism expression to Cytoscape data"

# Triggers
##########

# Note: Trigger are not allowed inside packages, hence the naming convention.

wsk trigger create $PKG-concept --feed "$CLOUDANT_PKG/changes" \
  --param dbname "$CLOUDANT_DBNAME" \
  --param filter "schema/by_schema" \
  --param query_params '{"schema":"concept"}'
