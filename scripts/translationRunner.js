// translationRunner.js
const manageTranslations = require('react-intl-translations-manager').default;

manageTranslations({
  messagesDirectory: "app/i18n/extracted",
  translationsDirectory: "app/i18n/translations/",
  jsonOptions: {
    space: 2,
    trailingNewline: true,
  },

  // untranslated lang gets all messages from the app
  // dev lang is used during development to test translated strings (can
  // be freely modified)
  // all other production languages are translated at transifex
  languages: ['untranslated', "dev"],
});
