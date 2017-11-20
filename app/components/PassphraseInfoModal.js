import React from "react";
import SlateGrayButton from "SlateGrayButton";
import "style/PurchaseTicketsInfo.less";
import { FormattedMessage as T } from "react-intl";

class PassphraseInfoModal extends React.Component {
  render() {
    return (
      <div className="passphrase-info-modal">
        <div className="purchase-tickets-header">
          <SlateGrayButton className="purchase-tickets-close-button" onClick={() =>this.props.closeModal()}>Close</SlateGrayButton>
        </div>
        <div className="purchase-tickets-column-double">
          {this.renderSection(
            <T id="passphrase.info.header" m="Wallet's private passphrase" />,
            <T id="passphrase.info.message" m="This passphrase should be " />
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

export default PassphraseInfoModal;
