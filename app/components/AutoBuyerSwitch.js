// @flow
import React from 'react';
import Radium from 'radium';
import { StakePoolStyles } from './views/ViewStyles';

class AutoBuyerSwitch extends React.Component {
  render() {
    return (
      <div style={this.props.enabled ? StakePoolStyles.switchEnabled : StakePoolStyles.switchDisabled} onClick={this.props.onClick}>
        <div  style={this.props.enabled ? StakePoolStyles.switchKnobEnabled : StakePoolStyles.switchKnobDisabled}>
        </div>
      </div>
    );

  }
}

export default Radium(AutoBuyerSwitch);