// @flow
import React from "react";
import "../style/StakePool.less";

export default class AutoBuyerSwitch extends React.Component {
  render() {
    return (
      <div className="autobuyer-switch">
        <div className={this.props.enabled ? "autobuyer-switch-enabled" : "autobuyer-switch-disabled"} onClick={this.props.onClick}>
          <div className={this.props.enabled ? "autobuyer-switch-knob-enabled" : "autobuyer-switch-knob-disabled"}></div>
        </div>
      </div>
    );
  }
}