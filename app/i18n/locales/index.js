import staticDefaults from "../extracted/static";

// Extra formats. May be customized by each locale.
export const defaultFormats = {
  number: {
    "two-decimals": {
      minimumFractionDigits: 2
    },
    "precise-percent": {
      style: "percent",
      minimumFractionDigits: 4
    }
  }
};

const en = {
  key: "en",
  language: "en",
  description: "English",
  messages: staticDefaults, // uses defaultMessage for anything not on the staticDefaults
  formats: defaultFormats //dont customize for en language
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
const dev = {
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
