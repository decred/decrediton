// @flow
import React from "react";
import SlateGrayButton from "SlateGrayButton";
import "style/PurchaseTicketsInfo.less";
import { FormattedMessage as T } from "react-intl";

class VerifyMessageInfo extends React.Component {
  render() {
    return (
      <div className="purchase-tickets-modal">
        <div className="purchase-tickets-header">
          <div className="purchase-tickets-header-text">
            <T id="verify.info.title" m="Verify Message Information" />
          </div>
          <SlateGrayButton className="purchase-tickets-close-button" onClick={() =>this.props.closeModal()}>Close</SlateGrayButton>
        </div>
        <div className="purchase-tickets-column-double">
          {this.renderSection(
            <T id="verify.info.header" m="Verifying Signature" />,
            <T id="verify.info.message" m="After you or your counterparty has generated a signature, you can use this form to verify the validity of the signature.  Once you have entered the address, the message and the corresponding signature, you will see VALID if the signature appropriately matches the address and message, otherwise INVALID." />
          )}
        </div>
      </div>
    );
  }

  renderSection(header, text) {
    return (
      <div className="purchase-tickets-section">
        <span className="purchase-tickets-section-header">{header}</span> - {text}
      </div>
    );
  }

}

export default VerifyMessageInfo;
