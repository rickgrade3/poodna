//https://dev.to/smetzdev/how-to-setup-create-react-app-twin-macro-and-emotion-4ahd
const path = require("path");
const webpack = require("webpack");
const resolvePackage = (relativePath) => path.resolve(__dirname, relativePath);
const { getLoader, loaderByName } = require("@craco/craco");

const module1 = path.join(__dirname, "../datatype");
const module2 = path.join(__dirname, "../design-system");
const module3 = path.join(__dirname, "../util");

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  babel: {
    plugins: [
      "babel-plugin-macros",
      [
        "@emotion/babel-plugin-jsx-pragmatic",
        {
          export: "jsx",
          import: "__cssprop",
          module: "@emotion/react",
        },
      ],
      [
        "@babel/plugin-transform-react-jsx",
        {
          pragma: "__cssprop",
          pragmaFrag: "React.Fragment",
        },
      ],
    ],
  },
  webpack: {
    alias: {
      react: path.resolve("node_modules/react"),
      Icon: path.resolve(__dirname, "src/icon.js"),
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          React: "react",
          Icon: "Icon",
        }),
      ] /* An array of plugins */,
    },
    configure: (webpackConfig, { env, paths }) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName("babel-loader")
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];

        match.loader.include = include
          .concat(module1)
          .concat(module2)
          .concat(module3);
      }
      return webpackConfig;
    },
  },
};
