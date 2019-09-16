const composer = require('openwhisk-composer')

module.exports = composer.sequence(
  composer.merge("open-discovery/expression_to_graphviz_json")
)
