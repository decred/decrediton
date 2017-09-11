// @flow
import React from "react";
import { connect } from "react-redux";
import "../style/Balance.less";

function mapStateToProps(state) {
  return {
    currentSettings: state.settings.currentSettings,
  };
}


class Balance extends React.Component {
  render() {
    const { currentSettings } = this.props;
    if (currentSettings.currencyDisplay === "DCR") {
      var totalDcr = 0;
      var numberFormatPart = ["0","0"];
      if (typeof this.props.amount !== "undefined" && this.props.amount !== 0) {
        totalDcr = parseInt(this.props.amount) / 100000000;
        numberFormatPart = totalDcr.toFixed(8).toString().split(".");
      }
      return (
        <span
        className="balance-base"
        onClick={this.props.onClick}
        >
          {numberFormatPart[0]}.{numberFormatPart[1].toString().slice(0,2)}
          <span className="balance-small">{numberFormatPart[1].toString().slice(2)}</span>
          <span className="balance-small"> DCR</span>
        </span>
      );
    } else if (currentSettings.currencyDisplay === "atoms") {
      return (
        <span
        className="balance-base"
        onClick={this.props.onClick}
        >
          {this.props.amount}
          <span className="balance-small"> atoms</span>
        </span>
      );
    }
  }
}
export default connect(mapStateToProps)(Balance);
