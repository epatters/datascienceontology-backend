const composer = require('openwhisk-composer')

module.exports = composer.sequence(
  "data-science-ontology/concept_map_as_graphviz",
  params => Object.assign(params, {
    format: "json0",
  }),
  "open-discovery/graphviz",
  params => ({
    graphviz: JSON.parse(params.data),
  }),
  "open-discovery/graphviz_json_to_cytoscape"
)