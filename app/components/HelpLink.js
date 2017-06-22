// @flow
import Radium from 'radium';
import React from 'react';
import { shell } from 'electron';
import leftLinkColor from './icons/menu-link-left-color.png';

var styles = {
  linkColor: {
    cursor: 'pointer',
    display: 'block',
    width: '50%',
    height: '53px',
    backgroundImage: `url(${leftLinkColor})`,
    backgroundPosition: '0px 50%',
    backgroundSize: '0px',
    backgroundRepeat: 'repeat-y',
    ':hover': {
      backgroundColor: '#616262',
      backgroundSize: '5px',
    },
  },
  helpLink:{
    display: 'block',
    height: '38px',
    paddingTop: '15px',
    paddingLeft: '40px',
    color: 'black',
    fontSize: '18px',
    textAlign: 'left',
    textDecoration: 'none',
    textTransform: 'capitalize',
  },
};

class HelpLink extends React.Component {
  render() {
    return (
      <div style={styles.linkColor}>
        <a style={styles.helpLink} onClick={function(x){shell.openExternal(x);}.bind(null, this.props.href)}>
          {this.props.children}
        </a>
      </div>
    );
  }
}
module.exports = Radium(HelpLink);
