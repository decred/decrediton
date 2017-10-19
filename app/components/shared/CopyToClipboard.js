// @flow
import React, { Component } from "react";
import { PropTypes } from "prop-types";
import copy from "clipboard-copy";
import { autobind } from "core-decorators";
import { FormattedMessage as T } from "react-intl";
import { Aux } from "shared";
import "../style/MiscComponents.less";

@autobind
class CopyToClipboardButton extends Component {

  static propTypes = {
    textToCopy: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      successState: "hidden"
    };
  }

  render() {
    const successBannerClassname = ["copy-to-clipboard-success", this.state.successState].join(" ");
    const buttonclassName = ["copy-to-clipboard-icon", this.props.className].join(" ");
    return (
      <Aux>
        <div className={ successBannerClassname }>
          <T id="clipboard.copied" m="Copied" />
        </div>
        <a className={ buttonclassName } onClick={this.onClick} onMouseLeave={this.onMouseLeave} />
      </Aux>
    );
  }

  onClick() {
    if(copy(this.props.textToCopy)) {
      this.setState({ showTooltip: "success" });
    }
  }

  onMouseLeave() {
    if(this.state.showTooltip) {
      this.setState({ showTooltip: "hidden" });
    }
  }
}

export default CopyToClipboardButton;
