// @flow
import React from "react";
import "../../../style/Header.less";
import { autobind } from "core-decorators";
import { injectIntl } from "react-intl";

@autobind
class Message extends React.Component {
  render() {
    const { intl, message, values } = this.props;
    const txt = intl.formatMessage(message, values);
    return <div className={"snackbar-information"}>
      <div className="snackbar-information-">
        <div className="snackbar-message">
          {txt}
        </div>
      </div>
    </div>
  }
};

export default injectIntl(Message);
