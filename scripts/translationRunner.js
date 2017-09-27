// translationRunner.js
const manageTranslations = require('react-intl-translations-manager').default;

// es2015 import
// import manageTranslations from 'react-intl-translations-manager';

manageTranslations({
  messagesDirectory: "app/i18n/extracted",
  translationsDirectory: "app/i18n/translations/",
  whitelistsDirectory: "app/i18n/translations-whitelists/",
  languages: ['pt-BR'], // any language you need
});
