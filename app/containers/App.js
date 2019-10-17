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
import AutobuyerRunningModal from "../components/modals/AutobuyerRunningModal/AutobuyerRunningModal";
import { log } from "wallet";
import { TrezorModals } from "components/modals/trezor";
import "style/Themes.less";
import "style/Layout.less";
import { ipcRenderer } from "electron";
const topLevelAnimation = { atEnter: { opacity: 0 }, atLeave: { opacity: 0 }, atActive: { opacity: 1 } };

// minimum size to reduce the sidebar in px.
const MINIMUM_SIZE_TO_REDUCE_SIDEBAR = 1179;
// minimum size to sidebar goes to bottom in px.
const MINIMUM_SIZE_BOTTOM_SIDEBAR = 768;

@autobind
class App extends React.Component {
  static propTypes = {
    locale: PropTypes.object.isRequired,
    window: PropTypes.object.isRequired,
    shutdownApp: PropTypes.func.isRequired,
    shutdownRequested: PropTypes.bool.isRequired,
    daemonStopped: PropTypes.bool.isRequired,
    autobuyerRunningModalVisible: PropTypes.bool.isRequired,
    hideAutobuyerRunningModal: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    const { window } = props;
    window.addEventListener("beforeunload", this.beforeWindowUnload);
    window.addEventListener("click", this.onClick);
    window.addEventListener("auxclick", this.onAuxClick);
    this.isWaiting = false;
    window.addEventListener("resize", this.updateWindowDimensions);
    this.updateWindowDimensions();
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
    ipcRenderer.on("check-auto-buyer-running", () => {
      if (this.props.isTicketAutoBuyerEnabled) {
        log("warning", "Auto buyer is still running, preventing shutdown");
        this.props.showAutobuyerRunningModal();
      } else {
        this.props.shutdownApp();
      }
    });
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

  updateWindowDimensions() {
    if (this.isWaiting) {
      return;
    }
    const updateWindow = () => {
      this.isWaiting = false;
      if (window.innerWidth <= MINIMUM_SIZE_BOTTOM_SIDEBAR) {
        this.props.onSidebarToBottom();
      } else if (window.innerWidth <= MINIMUM_SIZE_TO_REDUCE_SIDEBAR) {
        this.props.onSidebarLeaveBottom();
        this.props.onReduceSideBar();
      } else {
        this.props.onSidebarLeaveBottom();
        this.props.onExpandSideBar();
      }
    };
    this.isWaiting = true;
    setTimeout(updateWindow, 200);
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
    const { locale, theme, aboutModalMacOSVisible, hideAboutModalMacOS, autobuyerRunningModalVisible, hideAutobuyerRunningModal, shutdownApp } = this.props;
    const MainSwitch = this.props.uiAnimations ? AnimatedSwitch : StaticSwitch;

    return (
      <IntlProvider
        locale={locale.language}
        messages={locale.messages}
        formats={locale.formats}
        defaultFormats={defaultFormats}
        key={locale.key}>
        <main className={theme}>
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
          <div id="modal-portal-autobuyer-running">
            <AutobuyerRunningModal show={autobuyerRunningModalVisible} onSubmit={() => { hideAutobuyerRunningModal(); shutdownApp(); }} onCancelModal={hideAutobuyerRunningModal} />
          </div>
        </main>
      </IntlProvider>
    );
  }
}

export default app(theming(App));
