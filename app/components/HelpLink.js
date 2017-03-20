import Radium from 'radium';
import React from 'react';
import { shell } from 'electron';
import leftLinkColor from './icons/menu-link-left-color.png';

var styles = {
  linkColor: {
    display: 'block',
    height: '53px',
    backgroundImage: `url(${leftLinkColor})`,
    backgroundPosition: '0px 50%',
    backgroundSize: '0px',
    backgroundRepeat: 'repeat-y',
    ':hover': {
      backgroundColor: '#09182d',
      backgroundSize: '5px',
    },
  },
  menuNavigationLink: {
    display: 'block',
    height: '38px',
    paddingTop: '15px',
    paddingLeft: '40px',
    color: '#c4cbd2',
    fontSize: '18px',
    textAlign: 'left',
    textDecoration: 'none',
    textTransform: 'capitalize',
  },
  menuNavigationLinkActive: {
    backgroundColor: '#09182d',
    backgroundImage: `url(${leftLinkColor})`,
    backgroundPosition: '0px 50%',
    backgroundSize: '5px',
    backgroundRepeat: 'repeat-y',
    cursor: 'default',
  }
};

class HelpLink extends React.Component {
  render() {
    return (
      <div style={styles.linkColor}>
        <a style={styles.menuNavigationLink} onClick={function (x) { shell.openExternal(x); }.bind(null, this.props.href)}>
          {this.props.children}
        </a>
      </div>
    );
  }
}
module.exports = Radium(HelpLink);
