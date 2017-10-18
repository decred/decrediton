import React, { Component } from "react";
import { PropTypes } from "prop-types";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { IntlProvider } from "react-intl";
import theme from "../materialUITheme";
import { defaultFormats } from "../i18n/locales";
import app from "../connectors/app";
import SideBar from "../components/SideBar";
import Snackbar from "../components/Snackbar";

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    locale: PropTypes.object.isRequired,
  };

  render() {
    let locale = this.props.locale;

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
            {this.props.children}
          </div>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}

export default app(App);
