import { IntlProvider } from "react-intl";
import { defaultFormats } from "i18n/locales";
import { Redirect, Route, Switch } from "react-router-dom";
import { StaticSwitch } from "shared";
import GetStartedContainer from "../GetStarted";
import WalletContainer from "../Wallet";
import ShutdownPage from "components/views/ShutdownPage/ShutdownPage";
import FatalErrorPage from "components/views/FatalErrorPage/FatalErrorPage";
import Snackbar from "components/Snackbar";
import TrezorModals from "components/modals/TrezorModals/TrezorModals";
import { hot } from "react-hot-loader/root";
import { CantCloseModals, AboutModal, ConfirmationDialogModal } from "modals";
import { useApp } from "../hooks";
import styles from "./App.module.css";

const App = () => {
  const { hideAboutModalMacOS, locale, aboutModalMacOSVisible, theme } =
    useApp();

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
        <StaticSwitch className={styles.appContainer}>
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
        <ConfirmationDialogModal />
        <div id="modal-portal-autobuyer-running">
          <CantCloseModals />
        </div>
      </main>
    </IntlProvider>
  );
};

export default hot(App);
