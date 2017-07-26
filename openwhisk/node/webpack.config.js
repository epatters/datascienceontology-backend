var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    dot_json_to_cytoscape: "./src/actions/dot_json_to_cytoscape.ts",
    graphviz_to_cytoscape: "./src/actions/graphviz_to_cytoscape.ts",
    morphism_to_cytoscape: "./src/actions/morphism_to_cytoscape.ts",
  },
  output: {
    filename: "[name].bundle.js",
    path: __dirname + "/build"
  },
  resolve: {
    extensions: [".ts", ".js", ".json"]
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader"
      }
    ]
  },
  externals: [
    nodeExternals({
      whitelist: [
        "striptags"
      ]
    })
  ],
};
