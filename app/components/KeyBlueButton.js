import Radium from 'radium';
import React from 'react';

var styles = {
  base: {
    cursor: 'pointer',
    display: 'inline-block',
    padding: '17px 18px 18px',
    borderRadius: '5px',
    backgroundColor: '#2971ff',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, .2)',
    color: '#fff',
    fontSize: '13px',
    lineHeight: '9px',
    fontWeight: '600',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'capitalize',
    transitionProperty: 'all',
    transitionDuration: '100ms',
    transitionTimingFunction: 'cubic-bezier(0.86, 0, 0.07, 1)',
    transitionDelay: '0s',
    ':hover': {
      backgroundColor: '#1b58ff',
    },
    ':active': {
      boxShadow: '0 0 0 0 rgba(0, 0, 0, .2)',
    }
  },
  baseDisabled: {
    display: 'inline-block',
    padding: '17px 18px 18px',
    borderRadius: '5px',
    backgroundColor: 'grey',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, .2)',
    color: '#fff',
    fontSize: '13px',
    lineHeight: '9px',
    fontWeight: '600',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'capitalize',
  },
  block: {
    display: 'block',
  },
};

class KeyBlueButton extends React.Component {
  render() {
    return (
      <div
        style={! this.props.disabled ? [
          styles.base,
          this.props.style,
          this.props.block && styles.block
        ] : [styles.baseDisabled,
          this.props.style] }
        type={this.props.type}
        disabled={this.props.disabled}
        onClick={this.props.onClick}
        hidden={this.props.hidden}>
        {this.props.children}
      </div>
    );
  }
}
module.exports = Radium(KeyBlueButton);