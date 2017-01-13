import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';

const styles = {
  topBar: {
    height: '70px',
    width: "100%",
    backgroundColor: "#132f4b",
    color: "white",
  },
  title: {
    marginTop: '23px',
    marginLeft: '20px',
    position: 'absolute',
    fontSize: '1.5em',
  },
};

class Header extends Component {
  render() {
    return (
      <div style={styles.topBar}>
        <p style={styles.title}>Decred-Preview</p>
      </div>);
  }
}

export default Header;
