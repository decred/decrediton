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
    marginTop: '14px',
    marginLeft: '20px',
    position: 'absolute',
    fontSize: '1.2em',
  },
  sideBar: {
    position: 'absolute',
    top:'78',
    bottom:'0', 
    left:'8',
    width:'200px',
    background:'#132f4b',
  },
  sidebarLink: {
    display: 'block',
    padding: '16px 0px',
    color: '#757575',
    textDecoration: 'none',
  },
  active: {
    color: 'black',
    textDecoration: 'bold',
  },
};

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {open:false};
  }
  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    const { walletService } = this.props;
    const loggedIn = (
      <div>
        <div style={styles.topBar}>
          <p style={styles.title}>Decred-Preview</p>
        </div>
        <div style={styles.sideBar}>
          <p>Getting Started</p>
        </div>
      </div>

    );
    var output;
    output = loggedIn;
    return (output);
  }
}

export default Header;
