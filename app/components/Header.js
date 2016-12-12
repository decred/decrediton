import React, { Component, PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';

const styles = {
  sidebar: {
    width: 256,
    height: '100%',
  },
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
  divider: {
    margin: '8px 0',
    height: 1,
    backgroundColor: '#757575',
  },
  content: {
    padding: '16px',
    height: '100%',
    backgroundColor: '#2ed8a3',
  },
};

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {open:false};
  }
  handleToggle = () => this.setState({open: !this.state.open});
  
  render() {
    const page = "HOME";
    return (
      <div>
        <AppBar onLeftIconButtonTouchTap={this.handleToggle} title="Decrediton" />
        <Drawer
          ref="Drawer"
          docked={false}
          open={this.state.open}
          onRequestChange={open => this.setState({open})}
        >
          <MenuItem><Link to="/" style={styles.sidebarLink}>Home</Link></MenuItem>
          <MenuItem><Link to="/history" style={styles.sidebarLink}>Transaction History</Link></MenuItem>
          <MenuItem><Link to="/send" style={styles.sidebarLink}>Send Decred</Link></MenuItem>
          <MenuItem><Link to="/receive" style={styles.sidebarLink}>Receive Decred</Link></MenuItem>
        </Drawer>
      </div>
    );
  }
}

export default Header;