import React, { Component } from 'react';
import DecredLogo from './icons/DecredLogo';

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
  logo: {
    width: '149.5px',
    height: '28px',
    margin: '18px 25px',
  }
};

class Header extends Component {
  render() {
    return (
      <div style={styles.topBar}>
        <DecredLogo />
      </div>);
  }
}

export default Header;
