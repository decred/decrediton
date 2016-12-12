import React, { Component, PropTypes } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';

// For Customization Options, edit  or use
// './src/material_ui_raw_theme_file.jsx' as a template.
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../materialUITheme'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={theme}>
          <div>
            <Header/>
          </div>
          <div>
            {this.props.children}
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
