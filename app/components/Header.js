import React, { Component } from 'react';

const styles = {
  topBar: {
    position: 'absolute',
    top:'0px',
    right: '0px',
    left:'0px',
    height: '70px',
    backgroundColor: '#132f4b',
    color: 'white',
  },
  title: {
    marginTop: '23px',
    marginLeft: '20px',
    position: 'absolute',
    fontSize: '1.5em',
  },
};

class Header extends Component {
  render() {
    return (
      <div style={styles.topBar}>
        <p style={styles.title}>Decred-Preview</p>
      </div>);
  }
}

export default Header;
