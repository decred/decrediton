module.exports = {
  plugins: [
    [
      "postcss-preset-env",
      {
        // When developing with an installed `pi-ui`
        // Point the importFrom to the path of the package in your node_modules
        importFrom: "./node_modules/pi-ui/dist/exports.css"
      }
    ]
  ]
};
