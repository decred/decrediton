import { app, dialog } from "electron";
import fs from "fs";
import { getGlobalCfg } from "../config";
import { LOCALE } from "constants";
import {
  appLocaleFromElectronLocale,
  default as locales
} from "../i18n/locales";

const customMessages = {};

export async function loadCustomTranslation() {
  const opts = {
    filters: [
      { name: "JSON files", extensions: ["json"] },
      { name: "All files", extensions: ["*"] }
    ]
  };
  try {
    const res = await dialog.showOpenDialog(opts);
    if (res === undefined) return;
    if (res.canceled) return;
    if (res.filePaths.length == 0) return;
    const data = fs.readFileSync(res.filePaths[0]);
    const msgs = JSON.parse(data);

    const config = getGlobalCfg();
    const currLocale = config.get(LOCALE);
    customMessages[currLocale] = msgs;
    return currLocale;
  } catch (err) {
    dialog.showErrorBox("Error loading translation file", String(err));
  }
}

export function getCustomTranslationMessages() {
  const config = getGlobalCfg();
  const currLocale = config.get(LOCALE);
  const msgs = customMessages[currLocale];
  return msgs;
}

export function currentLocalePlusCustomMsgs() {
  const globalCfg = getGlobalCfg();
  const cfgLocale = globalCfg.get(LOCALE);
  let locale = locales.find((value) => value.key === cfgLocale);
  if (!locale) {
    const newCfgLocale = appLocaleFromElectronLocale(app.getLocale());
    globalCfg.set(LOCALE, newCfgLocale);
    locale = locales.find((value) => value.key === newCfgLocale);
  }
  const customMsgs = customMessages[cfgLocale] || {};
  locale.messages = { ...locale.messages, ...customMsgs };
  return locale;
}
