import React, { Component } from "react";
import { PropTypes } from "prop-types";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { IntlProvider } from "react-intl";
import theme from "materialUITheme";
import { defaultFormats } from "i18n/locales";
import app from "connectors/app";
import SideBar from "components/SideBar";
import Snackbar from "components/Snackbar";
import { RouteTransition } from "shared";

const opts = { stiffness: 150, damping: 15 };
const fade = { atEnter: { opacity: 0 }, atActive: { opacity: 1 }, atLeave: { opacity: 0 }};
const rootPath = ({ pathname }) => pathname.split("/")[1];

const wrapperComponent = props => <div className="page-view" { ...props } />;

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    locale: PropTypes.object.isRequired,
  };

  render() {
    let locale = this.props.locale;
    const pathname = rootPath(this.props.location);
    return (
      <MuiThemeProvider muiTheme={theme}>
        <IntlProvider
          locale={locale.language}
          messages={locale.messages}
          formats={locale.formats}
          defaultFormats={defaultFormats}
          key={locale.key}>
          <div className="page-body">
            <SideBar />
            <Snackbar />
            <RouteTransition className="page-container" {...{ wrapperComponent, pathname, opts, ...fade }}>
              { this.props.children }
            </RouteTransition>
          </div>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}

export default app(App);
