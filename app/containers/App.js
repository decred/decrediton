import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { IntlProvider } from "react-intl";
import { defaultFormats } from "../i18n/locales";
import ThemeProvider from "theme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import muiTheme from "../materialUITheme";
import app from "../connectors/app";
import SideBar from "../components/SideBar";

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    locale: PropTypes.object.isRequired,
  };

  render() {
    let locale = this.props.locale;

    return (
      <MuiThemeProvider muiTheme={ muiTheme }>
        <ThemeProvider>
          <IntlProvider
            locale={ locale.language }
            messages={ locale.messages }
            formats={ locale.formats }
            defaultFormats={ defaultFormats }
            key={ locale.key }>
            <div className="page-body">
              <SideBar />
              { this.props.children }
            </div>
          </IntlProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    );
  }
}

export default app(App);
