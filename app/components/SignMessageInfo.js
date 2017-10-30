// @flow
import React from "react";
import SlateGrayButton from "SlateGrayButton";
import "style/PurchaseTicketsInfo.less";
import { FormattedMessage as T } from "react-intl";

class SignMessageInfo extends React.Component {
  render() {
    return (
      <div className="purchase-tickets-modal">
        <div className="purchase-tickets-header">
          <div className="purchase-tickets-header-text">
            <T id="sign.info.title" m="Sign Message Information" />
          </div>
          <SlateGrayButton className="purchase-tickets-close-button" onClick={() =>this.props.closeModal()}>Close</SlateGrayButton>
        </div>
        <div className="purchase-tickets-column-double">
          {this.renderSection(
            <T id="sign.info.header" m="Signing a message" />,
            <T id="sign.info.message" m="Signing a message with an address' private key allows you to prove that you are the owner of a given address to a possible counterparty.  For instance, let's say you sent 100 DCR to a merchant and you have yet to receive your merchandise.  You contact the merchant and explain the situation, but need a way to prove you are, in fact, the owner of the address that the funds were sent from.  To do this you can generate a signature based on a message only known to you and your counterparty and the private key associated with the address.  Upon receipt, the counterparty may use the Verify Message form to ensure the signature is VALID." />
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

export default SignMessageInfo;
