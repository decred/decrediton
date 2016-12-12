import React, { Component, PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem'

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {open:false};
  }

  render() {
    return (
      <div>
        <AppBar onLeftIconButtonTouchTap={this._toggle} title="Decrediton" />
        <Drawer
          ref="Drawer"
          docked={false}
          open={this.state.open}
          onRequestChange={open => this.setState({open})}
        >
          <MenuItem>Settings</MenuItem>
        </Drawer>
      </div>
    );
  }
}

export default Header;