import React from 'react';
import Radium from 'radium';
import { StakePoolStyles } from './views/ViewStyles';

class ManagePoolsButton extends React.Component {
  render() {
    return (
      <a style={StakePoolStyles.managePoolsButton} onClick={this.props.onClick}></a>
    );

  }
}

export default Radium(ManagePoolsButton);