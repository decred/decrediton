// @flow
import Radium from "radium";
import React from "react";
import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    currentSettings: state.settings.currentSettings,
  };
}

var styles = {
  base: {
    fontSize: "1em",
    fontFamily: "Inconsolata, monospace",
  },
  small: {
    fontSize: "0.8em",
  },

  block: {
    display: "block",
  },
};

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
        style={styles.base}
        onClick={this.props.onClick}
        >
          {numberFormatPart[0]}.{numberFormatPart[1].toString().slice(0,2)}
          <span style={styles.small}>{numberFormatPart[1].toString().slice(2)}</span>
          <span style={styles.small}> DCR</span>
        </span>
      );
    } else if (currentSettings.currencyDisplay === "atoms") {
      return (
        <span
        style={styles.base}
        onClick={this.props.onClick}
        >
          {this.props.amount}
          <span style={styles.small}> atoms</span>
        </span>
      );
    }
  }
}
export default connect(mapStateToProps)(Radium(Balance));
