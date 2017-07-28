// @flow
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Radium from 'radium';
import copy from 'clipboard-copy';
import { ReceiveStyles } from './views/ViewStyles';

class CopyToClipboardButton extends Component {

  static propTypes = {
    textToCopy: PropTypes.string.isRequired
  };

  render() {
    var style = {};
    Object.assign(style, ReceiveStyles.copyToClipboardIcon);
    Object.assign(style, this.props.style);
    
    return <a style={style} onClick={() => copy(this.props.textToCopy)}></a>;
  }

}

export default Radium(CopyToClipboardButton);