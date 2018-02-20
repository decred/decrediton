module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
    "es6": true
  },
  "plugins": [
    "react"
  ],
  "parser": "babel-eslint",
  "extends": "eslint:recommended",
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
      "unix"
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
  },
  "globals": {
    "Uint8Array": true,
    "Map": true,
    "React": true,
    "PropTypes": true,
    "autobind": true,
    "Aux": true,
  }
};
