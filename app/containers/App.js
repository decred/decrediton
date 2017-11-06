import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { IntlProvider } from "react-intl";
import MUItheme from "materialUITheme";
import { defaultFormats } from "i18n/locales";
import app from "connectors/app";
import SideBar from "components/SideBar";
import Snackbar from "components/Snackbar";
import { RouteTransition } from "shared";
import { getPage } from "helpers";
import theme from "theme";
import "style/Layout.less";

const fade = { atEnter: { opacity: 0 }, atActive: { opacity: 1 }, atLeave: { opacity: 0 }};

const wrapperComponent = props => <div className="page-view" { ...props } />;

const App = ({ routes, children, locale }) => {
  const pathname = getPage(routes);
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
            { children }
          </RouteTransition>
        </div>
      </IntlProvider>
    </MuiThemeProvider>
  );
};

App.propTypes = {
  children: PropTypes.element.isRequired,
  locale: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
};

export default app(App);
