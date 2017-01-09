module.exports = {
  "env": {
    "browser": true,
    "node": true
  },
  "plugins": [
    "react"
  ],
  "parser": "babel-eslint",
  "extends": "eslint:recommended",
  "rules": {
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
      "single"
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
    "react/jsx-uses-vars":1,
    "react/jsx-uses-react":1,
  },
  "globals": {
    "Uint8Array": true
  }
};
