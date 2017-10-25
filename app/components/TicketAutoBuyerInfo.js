// @flow
import React from "react";
import SlateGrayButton from "./SlateGrayButton";
import "../style/PurchaseTicketsInfo.less";
import { FormattedMessage as T } from "react-intl";

class TicketAutobuyerInfo extends React.Component {
  render() {
    return (
      <div className="purchase-tickets-modal page-content">
        <div className="purchase-tickets-header">
          <div className="purchase-tickets-header-text">
            <T id="tickets.info.title" m="Ticket Purchase Information" />
          </div>
          <SlateGrayButton className="purchase-tickets-close-button" onClick={() =>this.props.closeModal()}>Close</SlateGrayButton>
        </div>
        <div className="purchase-tickets-column">
          {this.renderSection(
            <T id="tickets.info.balanceToMaintain.header" m="Balance to Maintain" />,
            <T id="tickets.info.balanceToMaintain.message" m="If your balance is lower than this number, you will not buy tickets. The default of 0 will use all the funds in your account to buy tickets." />
          )}
          {this.renderSection(
            <T id="tickets.info.maxFee.header" m="Max Fee" />,
            <T id="tickets.info.maxFee.message" m="Tickets are entered into the mempool in order of their fee per kilobyte. This sets the maximum fee you are willing to pay." />
          )}
          {this.renderSection(
            <T id="tickets.info.maxPriceAbsolute.header" m="Max Price Absolute" />,
            <T id="tickets.info.maxPriceAbsolute.message" m="If the ticket price is above this value, you will not buy more tickets. The default of 0 turns this off." />
          )}
          {this.renderSection(
            <T id="tickets.info.maxPriceRelative.header" m="Max Price Relative" />,
            <T id="tickets.info.maxPriceRelative.message" m="ickets are entered into the mempool in order of their fee per kilobyte. This sets the maximum fee you are willing to pay." />
          )}
          {this.renderSection(
            <T id="tickets.info.maxPerBlock.header" m="Max Per Block" />,
            <T id="tickets.info.maxPerBlock.message" m="Do not buy more than this number of tickets per block. A negative number means buy one ticket every n blocks. e.g. -2 would mean buy a ticket every second block." />

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

export default TicketAutobuyerInfo;
