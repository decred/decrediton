import React, { Component } from 'react';

const styles = {
  logo: {
    height: '13px',
    width: '13px',
    margin: '-2px 15px',
    backgroundColor: 'transparent',
  },
};

class LeftArrow extends Component {
  render() {
    return (
      <svg style={styles.logo} viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve">
        <polygon points="8,23 18,13 8,3"/>
      </svg>);
  }
}

export default LeftArrow;
