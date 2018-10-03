// translationRunner.js
const manageTranslations = require("react-intl-translations-manager").default;
const fs = require("fs");

const defaultOpts = {
  messagesDirectory: "app/i18n/extracted",
  translationsDirectory: "app/i18n/translations/",
  jsonOptions: {
    space: 2,
    trailingNewline: true,
  }
};

manageTranslations({
  ...defaultOpts,

  // dev lang is used during development to test translated strings (can
  // be freely modified)
  // all other production languages are translated at transifex
  languages: [ "dev" ],
});

// Remove original.json because react-intl-translations-manager doesn't update
// changed strings. This isn't an issue on the pot->po->json workflow because
// the pot files *do* get updated.
fs.unlinkSync("app/i18n/translations/original.json");

manageTranslations({
  ...defaultOpts,
  detectDuplicateIds: false,

  // original lang is the original, unmodified strings (needed when using english
  // strings but localized date/time/number/currency formats)
  languages: [ "original" ],

  overridePrinters: {
    printLanguageReport: () => {
      console.log("Updated original strings file.");
    },
  }
});
