// @flow
import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactTooltip from "react-tooltip";
import { PropTypes } from "prop-types";
import copy from "clipboard-copy";
import { autobind } from "core-decorators";
import { FormattedMessage as T } from "react-intl";
import "style/MiscComponents.less";

@autobind
class CopyToClipboardButton extends Component {

  static propTypes = {
    textToCopy: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      showTooltip: false
    };
  }

  render() {
    return (
      { this.state.showTooltip && <Tooltip text={ <T id="clipboard.copied" m="Copied" /> }> }
      <a
        ref="copyButtonRef"
        className={"copy-to-clipboard-icon" + (this.props.className ? (" " + this.props.className) : "")}
        style={this.props.style}
        data-place="bottom"
        onClick={this.onClick}
        onMouseLeave={this.onMouseLeave} />
      </Tooltip>
    );
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

export default CopyToClipboardButton;
