module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true
  },
  plugins: ["react", "react-hooks"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: ["eslint:recommended", "prettier"],
  rules: {
    "linebreak-style": ["error", "unix"],
    "jsx-quotes": ["error", "prefer-double"],
    quotes: ["error", "double", { avoidEscape: true }],
    semi: ["error", "always"],
    "no-trailing-spaces": ["error"],
    "no-console": ["off"],
    "eol-last": ["error", "always"],
    "no-alert": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "require-await": "error",
    "array-bracket-newline": ["error", "consistent"],
    "block-spacing": "error",
    "brace-style": ["error", "1tbs", { allowSingleLine: true }],
    "comma-dangle": ["error", "never"],
    "comma-spacing": [
      "error",
      {
        before: false,
        after: true
      }
    ],
    "comma-style": ["error", "last"],
    "computed-property-spacing": ["error", "never"],
    "func-call-spacing": ["error", "never"],
    "key-spacing": [
      "error",
      {
        beforeColon: false,
        afterColon: true
      }
    ],
    "no-lonely-if": "error",
    "object-curly-spacing": ["error", "always"],
    "no-var": "error",
    "prefer-const": "error",
    "arrow-spacing": "error",
    "react-hooks/exhaustive-deps": 2,
    "react/jsx-uses-vars": 1,
    "react/jsx-uses-react": 1,
    "react/jsx-no-target-blank": [2, { enforceDynamicLinks: "always" }]
  },
  globals: {
    Uint8Array: true,
    autobind: "readonly",
    React: "readonly",
    PropTypes: "readonly"
  }
};
