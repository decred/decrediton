import { useState } from "react";
import { IntlProvider } from "react-intl";
import { defaultFormats } from "i18n/locales";
import { Redirect, Route, Switch } from "react-router-dom";
import { StaticSwitch } from "shared";
import GetStartedContainer from "./GetStarted";
import WalletContainer from "./Wallet";
import ShutdownPage from "components/views/ShutdownPage/ShutdownPage";
import FatalErrorPage from "components/views/FatalErrorPage/FatalErrorPage";
import Snackbar from "components/Snackbar";
import AboutModal from "components/modals/AboutModal/AboutModal";
import { log } from "wallet";
import TrezorModals from "components/modals/TrezorModals/TrezorModals";
import "style/Layout.less";
import { ipcRenderer } from "electron";
import { hot } from "react-hot-loader/root";
import { CantCloseModals } from "modals";
import { useMountEffect } from "hooks";
import { useApp } from "./hooks";

// minimum size to reduce the sidebar in px.
const MINIMUM_SIZE_TO_REDUCE_SIDEBAR = 1179;
// minimum size to sidebar goes to bottom in px.
const MINIMUM_SIZE_BOTTOM_SIDEBAR = 768;

const App = () => {
  const {
    decreditonInit,
    shutdownApp,
    listenForAppReloadRequest,
    showAboutModalMacOS,
    hideAboutModalMacOS,
    showCantCloseModal,
    onExpandSideBar,
    onReduceSideBar,
    onSidebarToBottom,
    onSidebarLeaveBottom,
    locale,
    window,
    aboutModalMacOSVisible,
    modalVisible,
    canClose,
    theme
  } = useApp();

  const [isWaiting, setIsWaiting] = useState(false);

  const onClick = (event) => {
    const target = event.target;
    if (target.localName !== "a") return;
    const href = target.attributes.href ? target.attributes.href.value : "";
    if (href === "") {
      event.stopPropagation();
      event.preventDefault();
      return false;
    }
  };

  // Prevent middle click from opening new electron window
  const onAuxClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    return false;
  };

  const updateWindowDimensions = () => {
    if (isWaiting) {
      return;
    }
    const updateWindow = () => {
      setIsWaiting(false);
      if (window.innerWidth <= MINIMUM_SIZE_BOTTOM_SIDEBAR) {
        onSidebarToBottom();
      } else if (window.innerWidth <= MINIMUM_SIZE_TO_REDUCE_SIDEBAR) {
        onSidebarLeaveBottom();
        onReduceSideBar();
      } else {
        onSidebarLeaveBottom();
        onExpandSideBar();
      }
    };
    setIsWaiting(true);
    setTimeout(updateWindow, 200);
  };

  const onReloadRequested = () => {
    log("info", "Main app received reload UI request");
    ipcRenderer.send("app-reload-ui");
  };

  useMountEffect(() => {
    window.addEventListener("click", onClick);
    window.addEventListener("auxclick", onAuxClick);
    window.addEventListener("resize", updateWindowDimensions);
    updateWindowDimensions();
    decreditonInit();
    listenForAppReloadRequest(onReloadRequested);

    ipcRenderer.on("show-about-modal", () => {
      // Ignore click if a modal is already shown
      if (modalVisible == false) {
        showAboutModalMacOS();
      }
    });
    ipcRenderer.on("check-can-close", () => {
      if (canClose) {
        shutdownApp();
      } else {
        log("warning", "A process is still running, preventing shutdown");
        showCantCloseModal();
      }
    });

    log("info", "Main app container mounted");
  });

  return (
    <IntlProvider
      locale={locale.language}
      messages={locale.messages}
      formats={locale.formats}
      defaultFormats={defaultFormats}
      key={locale.key}>
      <main className={theme}>
        <Switch>
          <Redirect from="/" exact to="/getstarted" />
        </Switch>
        <Snackbar />
        <StaticSwitch className="top-level-container">
          <Route path="/getstarted" component={GetStartedContainer} />
          <Route path="/shutdown" component={ShutdownPage} />
          <Route path="/error" component={FatalErrorPage} />
          <Route path="/" component={WalletContainer} />
        </StaticSwitch>

        <div id="modal-portal" />
        <div id="modal-portal-macos">
          <AboutModal
            show={aboutModalMacOSVisible}
            onCancelModal={hideAboutModalMacOS}></AboutModal>
        </div>
        <TrezorModals />
        <div id="modal-portal-autobuyer-running">
          <CantCloseModals />
        </div>
      </main>
    </IntlProvider>
  );
};

export default hot(App);
