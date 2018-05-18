composer.sequence(
  composer.retain("open-discovery/expression_to_cytoscape"),
  ({ params, result }) => ({
    expression: params.expression,
    width: params.width,
    height: params.height,
    cytoscape: {
      elements: result.cytoscape.elements,
    },
  })
)
