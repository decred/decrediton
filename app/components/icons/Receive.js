import React, { Component } from 'react';

const styles = {
  logo: {
    height: '16.5px',
    width: '16.5px',
    margin: '0 15px',
    verticalAlign: 'middle',
  },
};

class Receive extends Component {
  render() {
    return (
      <svg style={styles.logo} viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve">
        <g id="XMLID_2443_">
          <rect id="XMLID_2447_" y="14" style={{fill:'#C6ECCB'}} width="26" height="14"/>
          <rect id="XMLID_2446_" x="6" y="4" style={{fill:'#41BF53'}} width="26" height="14"/>
          <rect id="XMLID_2445_" x="18" y="6" style={{fill:'#C6ECCB'}} width="2" height="10"/>
          <rect id="XMLID_2444_" x="14" y="10" style={{fill:'#C6ECCB'}} width="10" height="2"/>
        </g>
      </svg>);
  }
}

export default Receive;
