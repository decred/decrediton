// Script to check whether there are duplicate translation IDs (that is, strings
// with the same ID used in different files).
//
// This is usually caused during development by copying+pasting some block of
// code which includes a <T id=... m=... />  element.
//
// We block the use of duplicate IDs as that has been known to cause issues when
// translating the software.
const manageTranslations = require("react-intl-translations-manager").default;

const defaultOpts = {
  messagesDirectory: "app/i18n/extracted",
  translationsDirectory: "app/i18n/translations/",
  jsonOptions: {
    space: 2,
    trailingNewline: true,
  }
};

let hasDupes = false;
manageTranslations({
  ...defaultOpts,

  overridePrinters: {
    printDuplicateIds: duplicateIds => {
      const chalk = require("chalk");
      if (!duplicateIds || !duplicateIds.length) {
        console.log(chalk.green("No duplicate translation IDs found"));
        return;
      }

      hasDupes = true;
      console.log(chalk.red(`Found ${duplicateIds.length} duplicate translation IDs`));
      console.log("Please fix this by preventing reuse of the same translation ID in different messages");
      console.log("Duplicate IDs found:");
      duplicateIds.sort();
      duplicateIds.forEach(v => console.log(`  - ${v}`));
    },
    printLanguageReport: () => {},
    printNoLanguageFile: () => {},
    printNoLanguageWhitelistFile: () => {}
  },

  languages: [ "dev" ],
});

if (hasDupes) {
  process.exit(1);
}
