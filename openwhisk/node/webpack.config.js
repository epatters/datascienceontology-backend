module.exports = {
  entry: {
    dot_to_cytoscape: "./src/actions/dot_to_cytoscape.ts",
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
  }
};
