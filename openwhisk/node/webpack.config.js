module.exports = {
  entry: {
    cache_morphism_annotation: "./src/actions/cache_morphism_annotation.ts"
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
