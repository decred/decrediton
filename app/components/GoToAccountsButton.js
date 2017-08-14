// @flow
import React, { Component } from "react";
import "../style/MiscComponents.less";

class GoToAccountsButton extends Component {
  render() {
    return (
      <a
        ref="accountButtonRef"
        className="accounts-button-icon"
        data-place="bottom"
        data-type="info"
        data-effect="solid"
        data-tip={"Accounts"}
        onClick={this.onClick} />
    );
  }
}

export default GoToAccountsButton;
