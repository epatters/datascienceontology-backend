composer.sequence(
  args => Object.assign(args, {
    $blocking: true, // Work around Composer bug.
  }),
  composer.task("open-discovery/expression_to_cytoscape", { merge: true }),
  args => JSON.stringify({
    expression: args.expression,
    width: args.width,
    height: args.height,
    cytoscape: {
      elements: args.cytoscape.elements,
    },
  })
)
