// @flow
import Radium from 'radium';
import React from 'react';
import leftLinkColor from './icons/menu-link-left-color.png';
import { Link } from 'react-router';

var styles = {
  linkColor: {
    cursor: 'pointer',
    display: 'block',
    height: '52px',
    backgroundImage: `url(${leftLinkColor})`,
    backgroundPosition: '0px 50%',
    backgroundSize: '0px',
    backgroundRepeat: 'repeat-y',
    transitionProperty: 'all',
    transitionDuration: '100ms',
    transitionTimingFunction: 'cubic-bezier(0.86, 0, 0.07, 1)',
    transitionDelay: '0s',
    ':hover': {
      backgroundColor: '#09182d',
      backgroundSize: '5px',
    },
  },
  menuNavigationLink:{
    display: 'block',
    height: '38px',
    paddingTop: '15px',
    paddingLeft: '58px',
    color: '#c4cbd2',
    fontSize: '18px',
    textAlign: 'left',
    textDecoration: 'none',
    textTransform: 'capitalize',
  },
  menuNavigationLinkActive:{
    backgroundColor: '#09182d',
    backgroundImage: `url(${leftLinkColor})`,
    backgroundPosition: '0px 50%',
    backgroundSize: '5px',
    backgroundRepeat: 'repeat-y',
    cursor: 'default',
  }
};

class MenuLink extends React.Component {
  render() {
    return (
      <div style={styles.linkColor}>
        <Link to={this.props.to} style={styles.menuNavigationLink} activeStyle={styles.menuNavigationLinkActive}>
          {this.props.children}
        </Link>
      </div>
    );
  }
}
module.exports = Radium(MenuLink);