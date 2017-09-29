const en = {
  key: "en",
  language: "en",
  description: "English",
  messages: {} // uses defaultMessage
};

const pt_BR = {
  key: "pt-BR",
  language: "pt-BR",
  description: "Português do Brasil",
  messages: require("../translations/pt.json")
};

// pseudo-locale for i18n testing during development. Can be freely
// modified.
export const dev = {
  key: "dev",
  language: "pt-BR", // must be one of the allowed locales of format.js/react-intl
  description: "Dev Locale for testing",
  messages: require("../translations/dev.json"),
};

const locales = [en, pt_BR];

if (process.env.NODE_ENV === "development") {
  locales.push(dev);
}

export default locales;
