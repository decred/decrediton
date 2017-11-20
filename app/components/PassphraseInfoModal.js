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
            <T id="passphrase.info.header" m="Private passphrase" />,
            <T id="passphrase.info.message" m="This passphrase ensures that no funds may be spent from this wallet without it.  It is used to encrypt your private keys associated with your addresses.  These private keys are required to sign transactions that spend from the addresses.  Make sure to use a high-security passphrase and keep this passphrase in a secure place.   With your wallet file and this private passphrase an attacker would have full control over any funds associated with this wallet." />
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
