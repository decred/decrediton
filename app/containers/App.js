import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { IntlProvider } from "react-intl";
import MUItheme from "materialUITheme";
import { defaultFormats } from "i18n/locales";
import app from "connectors/app";
import { Redirect, Route, Switch } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";
import GetStartedContainer from "./GetStarted";
import WalletContainer from "./Wallet";
import ShutdownAppPage from "components/views/ShutdownAppPage";
import Snackbar from "components/Snackbar";
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
    this.refreshing = false;

    props.listenForAppReloadRequest(this.onReloadRequested);
  }

  componentWillUnmount () {
    window.removeEventListener("beforeunload", this.beforeWindowUnload);
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
      this.props.shutdownApp();
    }
  }

  onReloadRequested(event) {
    this.refreshing = true;
    event.sender.send("app-reload-ui");
  }

  render() {
    const { locale } = this.props;
    return (
      <MuiThemeProvider muiTheme={MUItheme}>
        <IntlProvider
          locale={locale.language}
          messages={locale.messages}
          formats={locale.formats}
          defaultFormats={defaultFormats}
          key={locale.key}>
          <Aux>
            <Switch><Redirect from="/" exact to="/getStarted" /></Switch>
            <Snackbar/>
            <AnimatedSwitch {...topLevelAnimation} className="top-level-container">
              <Route path="/getStarted"  component={GetStartedContainer} />
              <Route path="/shutdown"    component={ShutdownAppPage} />
              <Route path="/"            component={WalletContainer} />
            </AnimatedSwitch>
            <div id="modal-portal" />
          </Aux>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}

export default app(App);
