import Radium from 'radium';
import React from 'react';

var styles = {
  base: {
    fontSize: '1em',
  },
  small: {
    fontSize: '0.8em',
  },

  block: {
    display: 'block',
  },
};

class Balance extends React.Component {
  render() {
    var totalDcr = 0;
    var numberFormatPart = ['0','0'];
    if (typeof this.props.amount !== 'undefined' && this.props.amount !== 0) {
      totalDcr = parseInt(this.props.amount) / 100000000;
      numberFormatPart = totalDcr.toString().split('.');
    }
    return (
      <span
      style={styles.base}
      onClick={this.props.onClick}
      >
        {numberFormatPart[0]}.{numberFormatPart[1].toString().slice(0,2)}
        <span style={styles.small}>{numberFormatPart[1].toString().slice(2)}</span>
      </span>
    );
  }
}
module.exports = Radium(Balance);
