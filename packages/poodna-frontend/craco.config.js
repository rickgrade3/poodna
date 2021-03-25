const path = require("path");
const resolvePackage = (relativePath) => path.resolve(__dirname, relativePath);
const { getLoader, loaderByName } = require("@craco/craco");
const module1 = path.join(__dirname, "../poodna-type");
const module2 = path.join(__dirname, "../poodna-design-system");
module.exports = {
  webpack: {
    alias: {
      react: resolvePackage("./node_modules/react"),
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

        match.loader.include = include.concat(module1).concat(module2);
      }
      return webpackConfig;
    },
  },
};
