import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
const styles = {
  footer: {
    height: '142px',
    background: 'orange',
  }
};

class Footer extends Component {
  render() {
    return (
      <div style={styles.footer}>
        <p>Version 4.2.1</p>
      </div>);
  }
}

export default Radium(Footer);
