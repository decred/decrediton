import Radium from 'radium';
import React from 'react';

var styles = {
  base: {
    display: 'inline-block',
    padding: '17px 18px 18px',
    borderRadius: '5px',
    backgroundColor: '#2971ff',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, .2)',
    transitionProperty: 'none',
    color: '#fff',
    fontSize: '13px',
    lineHeight: '9px',
    fontWeight: '600',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'capitalize',
    ':hover': {
      backgroundColor: '#1b58ff',
    },
    ':active': {
      boxShadow: '0 0 0 0 rgba(0, 0, 0, .2)',
    }
  },
  block: {
    display: 'block',
  },
};

class KeyBlueButton extends React.Component {
  render() {
    return (
      <div
        style={[
          this.props.style,
          styles.base,
          this.props.block && styles.block
        ]}
        type={this.props.type}
        disabled={this.props.disabled}
        onClick={this.props.onClick}>
        {this.props.children}
      </div>
    );
  }
}
module.exports = Radium(KeyBlueButton);