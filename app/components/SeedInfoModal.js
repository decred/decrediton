import React from "react";
import SlateGrayButton from "SlateGrayButton";
import "style/PurchaseTicketsInfo.less";
import { FormattedMessage as T } from "react-intl";

class SeedInfoModal extends React.Component {
  render() {
    return (
      <div className="confirm-seed">
        <div className="purchase-tickets-header">
          <SlateGrayButton className="purchase-tickets-close-button" onClick={() =>this.props.closeModal()}>Close</SlateGrayButton>
        </div>
        <div className="purchase-tickets-column-double">
          {this.renderSection(
            <T id="seedEntry.info.header" m="Your wallet's seed:" />,
            <T id="seedEntry.info.message" m="Your seed is what defines everything about your particular wallet.  Using this seed will always" />
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

export default SeedInfoModal;
