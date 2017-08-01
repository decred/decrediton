import React, { Component } from "react";
import { PropTypes } from "prop-types";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import theme from "../materialUITheme";
import {StyleRoot} from "radium";

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <StyleRoot>
        <MuiThemeProvider muiTheme={theme}>
          <div>
            {this.props.children}
          </div>
        </MuiThemeProvider>
      </StyleRoot>
    );
  }
}
