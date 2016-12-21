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
    const { stepIndex, walletService } = this.props;
    const loggedIn = (
      <div>
        <AppBar onLeftIconButtonTouchTap={walletService !== null ? this.handleToggle : null} title="Decrediton (in development)" />
        <Drawer
          ref="Drawer"
          docked={false}
          open={this.state.open}
          onRequestChange={open => this.setState({open})}
        >
          <MenuItem><Link to="/home" style={styles.sidebarLink} onClick={this.handleToggle} activeStyle={styles.active}>Home</Link></MenuItem>
          <MenuItem><Link to="/history" style={styles.sidebarLink} onClick={this.handleToggle} activeStyle={styles.active}>History</Link></MenuItem>
          <MenuItem><Link to="/send" style={styles.sidebarLink} onClick={this.handleToggle} activeStyle={styles.active}>Send Decred</Link></MenuItem>
          <MenuItem><Link to="/receive" style={styles.sidebarLink} onClick={this.handleToggle} activeStyle={styles.active}>Receive Decred</Link></MenuItem>
        </Drawer>
      </div>
    );
    var output;
    if (walletService === null) {
      output = (<div></div>);
    } else {
      output = loggedIn;
    }
    return (output);
  }
}

export default Header;