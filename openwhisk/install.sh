#!/usr/bin/env bash

PKG="data-science-ontology"
CLOUDANT_PKG="Bluemix_Cloudant_Root"
CLOUDANT_DBNAME="data-science-ontology"

DOCKER="epatters"
NODE="./node/build"

# Package
#########

wsk package update --shared yes $PKG -a description "Data Science Ontology"

# Actions
#########

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

wsk action update $PKG/morphism_to_cytoscape \
  "$NODE/morphism_to_cytoscape.bundle.js" \
  -a description "Convert a morphism expression to Cytoscape data"

wsk action update $PKG/cache_concept \
  "$NODE/cache_concept.bundle.js" \
  -a description "Re-compute cached content for concept document"

# Triggers
##########

# Note: Trigger are not allowed inside packages, hence the naming convention.

wsk trigger create $PKG-concept --feed "$CLOUDANT_PKG/changes" \
  --param dbname "$CLOUDANT_DBNAME" \
  --param filter "schema/by_schema" \
  --param query_params '{"schema":"concept"}'
