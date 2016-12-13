import React, { Component, PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';

const styles = {
  sidebarLink: {
    display: 'block',
    padding: '16px 0px',
    color: '#757575',
    textDecoration: 'none',
  },
  sidebarLinkCurrentPage: {
    display: 'block',
    padding: '16px 0px',
    color: 'white',
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
    const page = 'HOME';
    return (
      <div>
        <AppBar onLeftIconButtonTouchTap={this.handleToggle} title="Decrediton" />
        <Drawer
          ref="Drawer"
          docked={false}
          open={this.state.open}
          onRequestChange={open => this.setState({open})}
        >
          <MenuItem><Link to="/" style={styles.sidebarLink} onClick={this.handleToggle}>Home</Link></MenuItem>
          <MenuItem><Link to="/history" style={styles.sidebarLink} onClick={this.handleToggle}>Transaction History</Link></MenuItem>
          <MenuItem><Link to="/send" style={styles.sidebarLink} onClick={this.handleToggle}>Send Decred</Link></MenuItem>
          <MenuItem><Link to="/receive" style={styles.sidebarLink} onClick={this.handleToggle}>Receive Decred</Link></MenuItem>
        </Drawer>
      </div>
    );
  }
}

export default Header;