import staticDefaults from "../extracted/static";
import { addLocaleData } from "react-intl";

import de_data from "react-intl/locale-data/de";
import en_data from "react-intl/locale-data/en";
import es_data from "react-intl/locale-data/es";
import fr_data from "react-intl/locale-data/fr";
import ja_data from "react-intl/locale-data/ja";
import pt_data from "react-intl/locale-data/pt";
import zh_data from "react-intl/locale-data/zh";

addLocaleData([ ...de_data, ...en_data, ...es_data, ...fr_data, ...ja_data,
  ...pt_data, ...zh_data ]);

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
  },
  date: {
    "day-short-month": {
      day: "numeric",
      month: "short"
    }
  }
};

const de = {
  key: "de",
  language: "de",
  description: "Deutsch",
  messages: require("../translations/de.json"),
  formats: defaultFormats
};

const en = {
  key: "en",
  language: "en",
  description: "English (US)",
  messages: staticDefaults, // uses defaultMessage for anything not on the staticDefaults
  formats: defaultFormats //dont customize for en language
};

const en_GB = {
  key: "en-GB",
  language: "en-GB",
  description: "English (UK)",
  messages: require("../translations/original.json"),
  formats: defaultFormats //dont customize for en language
};

const en_AU = {
  key: "en-AU",
  language: "en-AU",
  description: "English (AU)",
  messages: require("../translations/original.json"),
  formats: defaultFormats //dont customize for en language
};

const es = {
  key: "es",
  language: "es",
  description: "Español",
  messages: require("../translations/es.json"),
  formats: defaultFormats
};

const fr = {
  key: "fr",
  language: "fr",
  description: "Français",
  messages: require("../translations/fr.json"),
  formats: defaultFormats
};

const ja = {
  key: "ja",
  language: "ja",
  description: "日本語",
  messages: require("../translations/ja.json"),
  formats: defaultFormats
};

const pt_BR = {
  key: "pt-BR",
  language: "pt-BR",
  description: "Português do Brasil",
  messages: require("../translations/pt.json"),
  formats: defaultFormats
};

const zh = {
  key: "zh",
  language: "zh",
  description: "中文",
  messages: require("../translations/zh.json"),
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

const locales = [ de, en, en_GB, en_AU, es, fr, ja, pt_BR, zh ];

if (process.env.NODE_ENV === "development") {
  locales.push(dev);
}

export default locales;

// appLocaleFromElectronLocale returns the app locale that should be used for a given
// locale returned by electron's app.getLocale() function. Note that
// app.getLocale() can only be called after the app's ready() event is fired.
//
// The locale key returned by this function is guaranteed to exist.
export function appLocaleFromElectronLocale(electronLocale) {
  switch (electronLocale) {

  case "de":
  case "de-AT":
  case "de-CH":
  case "de-DE":
    return "de";

  case "en-GB":
    return "en-GB";
  case "en-AU":
    return "en-AU";

  case "es":
    return "es";

  case "fr":
  case "fr-CA":
  case "fr-CH":
  case "fr-FR":
    return "fr";

  case "ja":
    return "ja";

  case "pt":
  case "pt-BR":
  case "pt-PT":
    return "pt-BR";

  case "zh":
  case "zh-CN":
  case "zh-TW":
    return "zh";

  default: return "en";
  }
}
