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
            <T id="seedEntry.info.header" m="Wallet Seed" />,
            <T id="seedEntry.info.message" m="This 33 word seed is what is used to derive everything about your particular wallet.  With this seed you can regenerate this wallet from anywhere in the world.  While this does offer flexibility and easy back ups, it also means that this seed should be handled with the utmost security.  We recommend only having seeds written by hand in the most secure location you have. " />
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
