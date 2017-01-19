import React, { Component } from 'react';

const styles = {
  logo: {
    height: '16.5px',
    width: '16.5px',
    margin: '0 15px',
    verticalAlign: 'middle',
  },
};

class Sent extends Component {
  render() {
    return (
      <svg style={styles.logo} viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve">
		    <g id="XMLID_2395_">
          <rect id="XMLID_2398_" y="14" style={{fill:'#FD714B'}} width="26" height="14"/>
			    <rect id="XMLID_2397_" x="6" y="4" style={{fill:'#FEB8A5'}} width="26" height="14"/>
			    <rect id="XMLID_2396_" x="14" y="10" style={{fill:'#FD714B'}} width="10" height="2"/>
		    </g>
      </svg>);
  }
}

export default Sent;
