// @flow
import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactTooltip from "react-tooltip";
import { PropTypes } from "prop-types";
import Radium from "radium";
import copy from "clipboard-copy";
import { ReceiveStyles } from "./views/ViewStyles";


class CopyToClipboardButton extends Component {

  static propTypes = {
    textToCopy: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this.state = {
      showTooltip: false
    };
  }

  render() {
    var style = {};
    Object.assign(style, ReceiveStyles.copyToClipboardIcon);
    Object.assign(style, this.props.style);

    return (
      <a
        ref="copyButtonRef"
        style={style}
        data-place="bottom"
        data-type="info"
        data-effect="solid"
        data-tip={this.state.showTooltip ? "Copied!" : ""}
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave} />
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if(!prevState.showTooltip && this.state.showTooltip) {
      ReactTooltip.show(ReactDOM.findDOMNode(this.refs.copyButtonRef));
    }
    else if(prevState.showTooltip && !this.state.showTooltip) {
      ReactTooltip.hide(ReactDOM.findDOMNode(this.refs.copyButtonRef));
    }
  }

  onClick() {
    if(copy(this.props.textToCopy)) {
      this.setState({ showTooltip: true });
    }
  }

  onMouseLeave() {
    if(this.state.showTooltip) {
      this.setState({ showTooltip: false });
    }
  }

}

export default Radium(CopyToClipboardButton);