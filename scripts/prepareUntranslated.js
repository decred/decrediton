// translationRunner.js
const manageTranslations = require("react-intl-translations-manager").default;
const fs = require("fs");

// Copy the current original.json file to previous_original.json, since it will
// updated below.
fs.copyFileSync("app/i18n/translations/original.json", "app/i18n/translations/previous_original.json");

// Remove original.json because react-intl-translations-manager doesn't update
// changed strings. This isn't an issue on the pot->po->json workflow because
// the pot files *do* get updated.
fs.unlinkSync("app/i18n/translations/original.json");

// Generate the new originals.json file.
manageTranslations({
  messagesDirectory: "app/i18n/extracted",
  translationsDirectory: "app/i18n/translations/",
  jsonOptions: {
    space: 2,
    trailingNewline: true
  },
  detectDuplicateIds: false,
  languages: [ "original" ],
  overridePrinters: {
    printLanguageReport: () => {
      console.log("Updated original strings file.");
    }
  }
});
