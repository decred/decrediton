module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
    "es6": true
  },
  "plugins": [
    "react",
    "react-hooks"
  ],
  "parser": "babel-eslint",
  "extends": ["eslint:recommended", "prettier"],
  "rules": {
    "object-curly-spacing": [
      "error", 
      "always"
    ],
    "array-bracket-spacing": [
      "error", 
      "always"
    ],
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      (process.platform === "win32" ? "windows" : "unix")
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-trailing-spaces": [
      "error"
    ],
    "no-console": [
      "off"
    ],
    "eol-last": [
      "error",
      "always"
    ],
    "react/jsx-uses-vars":1,
    "react/jsx-uses-react":1,
    "react-hooks/exhaustive-deps": 2,
    "comma-dangle": ["error", "never"]
  },
  "globals": {
    "Uint8Array": true,
    "Map": true,
    "React": true,
    "PropTypes": true,
    "autobind": true,
    "Aux": true,
  },
};
