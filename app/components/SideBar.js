import React, { Component } from 'react';
import { Link } from 'react-router';

const styles = {
  sideBar: {
    position: 'absolute',
    top:'78px',
    bottom:'0px', 
    left:'8px',
    width:'200px',
    background:'#132f4b',
  },
  sidebarLink: {
    display: 'block',
    padding: '16px 0px',
    color: '#757575',
    textDecoration: 'none',
  },
  active: {
    color: 'black',
    textDecoration: 'bold',
  },
};

class SideBar extends Component {
  render() {
    return (
    <div style={styles.sideBar}>
      <p>Getting Started</p>
    </div>
    );
  }
}

export default SideBar;
