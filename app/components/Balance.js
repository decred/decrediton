import Radium from 'radium';
import React from 'react';

var styles = {
  base: {
    fontSize: '.5em',
  },

  block: {
    display: 'block',
  },
};

class Balance extends React.Component {
  render() {
    var totalDcr = parseInt(this.props.amount) / 100000000;
    var numberFormatPart = totalDcr.toString().split(".");
    console.log(numberFormatPart);
    console.log(totalDcr);
    var numberFormatPartAdd = numberFormatPart[1].toString().slice(2);
    console.log(numberFormatPartAdd);
    var numberFormatedShow = numberFormatPart[1].toString().replace(numberFormatPartAdd, '<span style="font-size=0.5em">' + numberFormatPartAdd + '</span>');
    console.log(numberFormatedShow);
    return (
      <span>
        {numberFormatPart[0]}.{numberFormatPart[1].toString().slice(0,2)}
        <span style={styles.base}>{numberFormatPart[1].toString().slice(2)}</span>
      </span>
    );
  }
}
module.exports = Radium(Balance);