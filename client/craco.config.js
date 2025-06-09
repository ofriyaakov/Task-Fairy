const path = require("path");

module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.m?js$/,
            resolve: {
              fullySpecified: false,
            },
          },
        ],
      },
    },
    alias: {
      "@": path.join(path.resolve(__dirname, "./src")),
    },
  },
};
