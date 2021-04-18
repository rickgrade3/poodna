const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const path = require("path");

// Version if the local Node.js version supports async/await
// webpack.config.js

module.exports = (async () => {
  return {
    mode: "production",
    entry: "./src/local.ts",
    target: "node",
    optimization: {
      // minimize: false, // <---- disables uglify.
      // minimizer: [new UglifyJsPlugin()] if you want to customize it.
    },
    plugins: [new Dotenv()],
    externals: {
      "@prisma/client": "@prisma/client",
      prisma: "prisma",
      express: { commonjs: "express" },
    },
    output: {
      libraryTarget: "commonjs",
      path: path.resolve(__dirname, "dist"),
      filename: "local.js",
    },

    resolve: {
      symlinks: false,
      extensions: [".ts", ".js", ".tsx"],
      plugins: [new TsconfigPathsPlugin()],
    },
    module: {
      rules: [{ test: /\.ts?$/, loader: "ts-loader" }],
    },
  };
})();
