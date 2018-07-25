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
import { log } from "wallet";
import "style/Layout.less";
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
    const { locale } = this.props;
    const MainSwitch = this.props.uiAnimations ? AnimatedSwitch : StaticSwitch;

    return (
      <IntlProvider
        locale={locale.language}
        messages={locale.messages}
        formats={locale.formats}
        defaultFormats={defaultFormats}
        key={locale.key}>
        <Aux>
          <Switch><Redirect from="/" exact to="/getStarted" /></Switch>
          <Snackbar/>
          <MainSwitch {...topLevelAnimation} className="top-level-container">
            <Route path="/getStarted"  component={GetStartedContainer} />
            <Route path="/shutdown"    component={ShutdownAppPage} />
            <Route path="/error"       component={FatalErrorPage} />
            <Route path="/"            component={WalletContainer} />
          </MainSwitch>
          <div id="modal-portal" />
        </Aux>
      </IntlProvider>
    );
  }
}

export default app(theming(App));
