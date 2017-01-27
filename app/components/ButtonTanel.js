import Radium from 'radium';
import React from 'react';

var styles = {
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.0rem',
    background: 'linear-gradient(#699bff, #2972ff)',
    border: 'none',
    borderRadius: 8,
    boxShadow: '0px 5px 5px 0px rgba(0, 0, 0, 0.3)',
    padding: '14px 16px',
    marginBottom: '20px',
    fontFamily: 'Inconsolata, monospace',
    color: 'white',
    ':hover': {
      background: '#2970ff',
    },

    ':focus': {
      background: '#5a6d81 !important',
      boxShadow: '0px 5px 5px 0px rgba(0, 0, 0, 0.3)'
    },
    ':active': {
      background: '#5a6d81 !important',
      boxShadow: '0px 5px 5px 0px rgba(0, 0, 0, 0.3)',
    },
    '@media (min-width: 320px)': {

    }
  },

  block: {
    display: 'block',
  },
};

class Button extends React.Component {
  render() {
    return (
      <button
        style={[
          styles.base,
          this.props.block && styles.block
        ]}
        type={this.props.type}
        disabled={this.props.disabled}
        onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}
module.exports = Radium(Button);