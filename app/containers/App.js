import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { IntlProvider } from "react-intl";
import MUItheme from "materialUITheme";
import { defaultFormats } from "i18n/locales";
import app from "connectors/app";
import SideBar from "components/SideBar";
import Snackbar from "components/Snackbar";
import { RouteTransition } from "shared";
import theme from "theme";

const fade = { atEnter: { opacity: 0 }, atActive: { opacity: 1 }, atLeave: { opacity: 0 }};
const rootPath = ({ pathname }) => pathname.split("/")[1];

const wrapperComponent = props => <div className="page-view" { ...props } />;

@autobind
class App extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    locale: PropTypes.object.isRequired,
    window: PropTypes.object.isRequired,
    shutdownApp: PropTypes.func.isRequired,
    shutdownRequested: PropTypes.bool.isRequired,
    daemonStopped: PropTypes.bool.isRequired,
  };

  constructor (props) {
    super(props);
    const { window } = props;
    this.windowUnloadHandler = window.addEventListener("beforeunload", this.beforeWindowUnload);
    this.refreshing = false;

    props.listenForAppReloadRequest(this.onReloadRequested);
  }

  componentWillUnmount () {
    const { window } = this.props;
    window.removeEventListener(this.windowUnloadHandler);
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
    let locale = this.props.locale;
    const pathname = rootPath(this.props.location);
    return (
      <MuiThemeProvider muiTheme={MUItheme}>
        <IntlProvider
          locale={locale.language}
          messages={locale.messages}
          formats={locale.formats}
          defaultFormats={defaultFormats}
          key={locale.key}>
          <div className="page-body">
            <SideBar />
            <Snackbar />
            <RouteTransition className="page-container" opts={ theme("springs.page") } {...{ wrapperComponent, pathname, ...fade }}>
              { this.props.children }
            </RouteTransition>
          </div>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}

export default app(App);
