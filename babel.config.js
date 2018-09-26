module.exports = function (api) {
  api.cache.forever();

  return {
    "presets": [
      "@babel/preset-env",
      "@babel/preset-react",
      "@babel/preset-flow"
    ],
    "plugins": [
      "@babel/plugin-transform-strict-mode",
      "@babel/plugin-transform-modules-commonjs",
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-syntax-import-meta",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-do-expressions",
      "@babel/plugin-proposal-export-default-from",
      "@babel/plugin-proposal-export-namespace-from",
      "@babel/plugin-proposal-function-bind",
      "@babel/plugin-proposal-function-sent",
      "@babel/plugin-proposal-json-strings",
      "@babel/plugin-proposal-logical-assignment-operators",
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-numeric-separator",
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-proposal-throw-expressions",
      [ "@babel/plugin-proposal-decorators", { "legacy": true } ],
      "./scripts/aliasDefaultMessage.js",
      [ "react-intl", { "messagesDir": "app/i18n/extracted" } ]
    ],
    "ignore": [
      "app/middleware/walletrpc/*.js"
    ]
  };
};
