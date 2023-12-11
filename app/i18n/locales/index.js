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
  },
  date: {
    "day-short-month": {
      day: "numeric",
      month: "short"
    },
    "short-month": {
      month: "short"
    },
    "short-month-24hour": {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      formatMatcher: "best fit"
    }
  }
};

const ar = {
  key: "ar",
  language: "ar",
  description: "اَلْعَرَبِيَّةُ",
  messages: require("../translations/ar.json"),
  formats: defaultFormats
};

const de = {
  key: "de",
  language: "de",
  description: "Deutsch",
  messages: require("../translations/de.json"),
  formats: defaultFormats
};

export const en = {
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

const it = {
  key: "it",
  language: "it",
  description: "Italiano",
  messages: require("../translations/it.json"),
  formats: defaultFormats
};

const ja = {
  key: "ja",
  language: "ja",
  description: "日本語",
  messages: require("../translations/ja.json"),
  formats: defaultFormats
};

const pl = {
  key: "pl",
  language: "pl",
  description: "język polski",
  messages: require("../translations/pl.json"),
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

const zh_HK = {
  key: "zh-HK",
  language: "zh-HK",
  description: "中文（繁體）",
  messages: require("../translations/zh-HK.json"),
  formats: defaultFormats
};

const id = {
  key: "id",
  language: "id-ID",
  description: "Bahasa Indonesia",
  messages: require("../translations/id.json"),
  formats: defaultFormats
};

const locales = [
  ar,
  de,
  en,
  en_GB,
  en_AU,
  es,
  it,
  fr,
  ja,
  pl,
  pt_BR,
  zh,
  zh_HK,
  id
];

export default locales;

// appLocaleFromElectronLocale returns the app locale that should be used for a given
// locale returned by electron's app.getLocale() function. Note that
// app.getLocale() can only be called after the app's ready() event is fired.
//
// The locale key returned by this function is guaranteed to exist.
export function appLocaleFromElectronLocale(electronLocale) {
  switch (electronLocale) {
    case "ar":
      return "ar";

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

    case "it":
    case "it-IT":
    case "it-CH":
      return "it";

    case "ja":
      return "ja";

    case "pl":
      return "pl";

    case "pt":
    case "pt-BR":
    case "pt-PT":
      return "pt-BR";

    case "zh":
    case "zh-CN":
      return "zh";

    case "zh-HK":
    case "zh-TW":
      return "zh-HK";

    case "id":
    case "id-ID":
      return "id-ID";  

    default:
      return "en";
  }
}
