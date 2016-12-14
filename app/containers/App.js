import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../materialUITheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={theme}>
          <div>
            <Header />
            {this.props.children}
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}