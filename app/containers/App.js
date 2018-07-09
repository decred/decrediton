import { IntlProvider } from "react-intl";
import { defaultFormats } from "i18n/locales";
import { app, theming } from "connectors";
import { Redirect, Route, Switch } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";
import { StaticSwitch } from "shared";
import GetStartedContainer from "./GetStarted";
import WalletContainer from "./Wallet";
import ShutdownAppPage from "components/views/ShutdownAppPage";
import FatalErrorPage from "components/views/FatalErrorPage";
import Snackbar from "components/Snackbar";
import AboutModal from "../components/modals/AboutModal/AboutModal";
import { log } from "wallet";
import { TrezorModals } from "components/modals/trezor";
import "style/Themes.less";
import "style/Layout.less";
import { ipcRenderer } from "electron";
const topLevelAnimation = { atEnter: { opacity: 0 }, atLeave: { opacity: 0 }, atActive: { opacity: 1 } };

@autobind
class App extends React.Component {
  static propTypes = {
    locale: PropTypes.object.isRequired,
    window: PropTypes.object.isRequired,
    shutdownApp: PropTypes.func.isRequired,
    shutdownRequested: PropTypes.bool.isRequired,
    daemonStopped: PropTypes.bool.isRequired,
  };

  constructor (props) {
    super(props);
    const { window } = props;
    window.addEventListener("beforeunload", this.beforeWindowUnload);
    window.addEventListener("click", this.onClick);
    window.addEventListener("auxclick", this.onAuxClick);
    this.refreshing = false;

    props.listenForAppReloadRequest(this.onReloadRequested);
  }

  componentWillUnmount () {
    window.removeEventListener("beforeunload", this.beforeWindowUnload);
  }

  componentDidMount() {
    log("info", "Main app container mounted");

    ipcRenderer.on("show-about-modal", () => {
      // Ignore click if a modal is already shown
      if (this.props.modalVisible == false) {
        this.props.showAboutModalMacOS();
      }
    });
  }

  beforeWindowUnload(event) {
    if (this.refreshing) {
      return;
    }

    const { shutdownRequested, daemonStopped } = this.props;
    if (!daemonStopped) {
      event.preventDefault();
      event.returnValue = false;
    }

    if (!shutdownRequested) {
      log("info", "Main app received shutdown request");
      this.props.shutdownApp();
    }
  }

  onClick(event) {
    const target = event.target;
    if (target.localName !== "a") return;
    const href = target.attributes.href ? target.attributes.href.value : "";
    if (href === "") {
      event.stopPropagation();
      event.preventDefault();
      return false;
    }
  }

  // Prevent middle click from opening new electron window
  onAuxClick(event) {
    event.stopPropagation();
    event.preventDefault();
    return false;
  }

  onReloadRequested(event) {
    log("info", "Main app received reload UI request");
    this.refreshing = true;
    event.sender.send("app-reload-ui");
  }

  render() {
    const { locale, theme, aboutModalMacOSVisible, hideAboutModalMacOS } = this.props;
    const MainSwitch = this.props.uiAnimations ? AnimatedSwitch : StaticSwitch;

    return (
      <IntlProvider
        locale={locale.language}
        messages={locale.messages}
        formats={locale.formats}
        defaultFormats={defaultFormats}
        key={locale.key}>
        <div className={theme}>
          <Switch><Redirect from="/" exact to="/getstarted" /></Switch>
          <Snackbar/>
          <MainSwitch {...topLevelAnimation} className="top-level-container">
            <Route path="/getstarted"  component={GetStartedContainer} />
            <Route path="/shutdown"    component={ShutdownAppPage} />
            <Route path="/error"       component={FatalErrorPage} />
            <Route path="/"            component={WalletContainer} />
          </MainSwitch>

          <div id="modal-portal" />
          <div id="modal-portal-macos" >
            <AboutModal show={aboutModalMacOSVisible} onCancelModal={hideAboutModalMacOS}></AboutModal>
          </div>
          <TrezorModals />
        </div>
      </IntlProvider>
    );
  }
}

export default app(theming(App));
