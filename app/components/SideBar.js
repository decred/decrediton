import React, { Component } from 'react';
import { Link } from 'react-router';

const styles = {
  sideBar: {
    position: 'absolute',
    top:'70px',
    bottom:'0px', 
    left:'0px',
    width:'200px',
    background:'white',
    borderRight: '1px solid black'
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
