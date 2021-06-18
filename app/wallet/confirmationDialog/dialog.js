import { ipcRenderer } from "electron";
import { encode as encodeAsHTML } from "he";
import { default as locales } from "i18n/locales";
import { getGlobalCfg } from "config";
import { LOCALE, THEME } from "constants/config";

let dialogRequestedCb, dialogHiddenCb;
const globalCfg = getGlobalCfg();

export const onConfirmationDialogCallbacks = (requested, hidden) => {
  dialogRequestedCb = requested;
  dialogHiddenCb = hidden;
};

export const escape = (s) => encodeAsHTML(s, { strict: true });

const formatContent = (content) => {
  const cfgLocale = globalCfg.get(LOCALE);
  let locale = locales.find((value) => value.key === cfgLocale);
  if (!locale) {
    locale = locales.find((value) => value.key === "en");
  }

  const fmt = (id, defaultMsg) => {
    let msg = defaultMsg;
    if (locale.messages[id]) msg = escape(locale.messages[id]);
    return msg;
  };

  const formattedContent = content.content.reduce((acc, v) => {
    if (typeof v === "string") {
      return acc + v;
    }
    if (typeof v === "object" && v.id && v.m) {
      return acc + fmt(v.id, v.m);
    }
    return acc;
  }, "");

  return {
    title: fmt(content.title.id, content.title.m),
    content: formattedContent,
    theme: globalCfg.get(THEME)
  };
};

let showingConf;
export const showConfirmationDialog = async (content) => {
  // Protect against showing multiple instances of the confirmation modal.
  if (showingConf) {
    throw new Error("already showing confirmation");
  }
  showingConf = true;

  // complete() will cleanup the state once we have a reply from the browser view.
  const complete = () => {
    dialogHiddenCb();
    showingConf = false;
  };

  // Expose the functions of a promise. This promise will be returned from this
  // function and its completion will determine whether the modal was accepted
  // or rejected.
  let okPromise, failPromise;
  const resPromise = new Promise((ok, fail) => {
    okPromise = (res) => {
      complete();
      ok(res);
    };
    failPromise = (err) => {
      complete();
      fail(err);
    };
  });

  try {
    if (!dialogRequestedCb) {
      throw new Error("Confirmation dialog CB not setup");
    }

    // Request main UI to show confirmation modal (blurs background).
    await dialogRequestedCb();

    ipcRenderer.once("confirmation-webframe-reply", (event, res) => {
      if (!res) {
        res = new Error("User rejected confirmation");
      }
      if (res instanceof Error) {
        failPromise(res);
        return;
      }

      okPromise(res);
    });

    ipcRenderer.send(
      "fill-confirmation-dialog-contents",
      formatContent(content)
    );
  } catch (error) {
    failPromise(error);
  }

  return resPromise;
};
