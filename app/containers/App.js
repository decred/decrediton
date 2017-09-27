import React, { Component } from "react";
import { PropTypes } from "prop-types";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { IntlProvider } from "react-intl";
import theme from "../materialUITheme";
import locales from "../i18n/locales";
import app from "../connectors/app";

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    locale: PropTypes.string.isRequired
  };

  render() {
    let locale = this.props.locale;
    return (
      <MuiThemeProvider muiTheme={theme}>
        <IntlProvider
          locale={locales[locale].name}
          messages={locales[locale].messages}
          key={locale}>
          {this.props.children}
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}

export default app(App);
