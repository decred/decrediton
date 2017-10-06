// @flow
import React, { Component } from "react";
import { injectIntl, defineMessages }  from "react-intl";
import "../style/MiscComponents.less";

const messages = defineMessages({
  accountsTip: {
    id: "accountsButton.tip",
    defaultMessage: "Accounts"
  }
});

class GoToAccountsButton extends Component {
  render() {
    const { formatMessage } = this.props.intl;
    return (
      <a
        ref="accountButtonRef"
        className="accounts-button-icon"
        data-place="bottom"
        data-type="info"
        data-effect="solid"
        data-tip={formatMessage(messages.accountsTip)}
        onClick={this.onClick} />
    );
  }
}

export default injectIntl(GoToAccountsButton);
