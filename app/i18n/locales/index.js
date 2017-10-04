// Extra formats. May be customized by each locale.
const defaultFormats = {
  time: {
    medium24: { //FIXME: not working for the default locale
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    },
    missing: undefined
  }
};

const en = {
  key: "en",
  language: "en",
  description: "English",
  messages: {}, // uses defaultMessage
  formats: defaultFormats
};

const pt_BR = {
  key: "pt-BR",
  language: "pt-BR",
  description: "Português do Brasil",
  messages: require("../translations/pt.json"),
  formats: defaultFormats
};

// pseudo-locale for i18n testing during development. Can be freely
// modified.
export const dev = {
  key: "dev",
  language: "pt-BR", // must be one of the allowed locales of format.js/react-intl
  description: "Dev Locale for testing",
  messages: require("../translations/dev.json"),
  formats: defaultFormats
};

const locales = [en, pt_BR];

if (process.env.NODE_ENV === "development") {
  locales.push(dev);
}

export default locales;
