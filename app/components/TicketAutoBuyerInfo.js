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
            <T id="TicketAutoBuyer.info.title" m="Ticket Auto Buyer Information" />
          </div>
          <SlateGrayButton className="purchase-tickets-close-button" onClick={() =>this.props.closeModal()}>Close</SlateGrayButton>
        </div>
        <div className="purchase-tickets-column">
          {this.renderSection(
            <T id="TicketAutoBuyer.info.balanceToMaintain.header" m="Balance to Maintain" />,
            <T id="TicketAutoBuyer.info.balanceToMaintain.message" m="If your balance is lower than this number, you will not buy tickets. The default of 0 will use all the funds in your account to buy tickets." />
          )}
          {this.renderSection(
            <T id="TicketAutoBuyer.info.maxFee.header" m="Max Fee" />,
            <T id="TicketAutoBuyer.info.maxFee.message" m="Tickets are entered into the mempool in order of their fee per kilobyte. This sets the maximum fee you are willing to pay." />
          )}
          {this.renderSection(
            <T id="TicketAutoBuyer.info.maxPriceAbsolute.header" m="Max Price Absolute" />,
            <T id="TicketAutoBuyer.info.maxPriceAbsolute.message" m="If the ticket price is above this value, you will not buy more tickets. The default of 0 turns this off." />
          )}
          {this.renderSection(
            <T id="TicketAutoBuyer.info.maxPriceRelative.header" m="Max Price Relative" />,
            <T id="TicketAutoBuyer.info.maxPriceRelative.message" m="Tickets are entered into the mempool in order of their fee per kilobyte. This sets the maximum fee you are willing to pay." />
          )}
          {this.renderSection(
            <T id="TicketAutoBuyer.info.maxPerBlock.header" m="Max Per Block" />,
            <T id="TicketAutoBuyer.info.maxPerBlock.message" m="Do not buy more than this number of tickets per block. A negative number means buy one ticket every n blocks. e.g. -2 would mean buy a ticket every second block." />
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
