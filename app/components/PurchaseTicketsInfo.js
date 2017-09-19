// @flow
import React from "react";
import SlateGrayButton from "./SlateGrayButton";
import "../style/PurchaseTicketsInfo.less";

class PurchaseTicketsInfo extends React.Component {
  render() {
    return (
      <div className="purchase-tickets-modal page-content">
        <div className="purchase-tickets-header">
          <div className="purchase-tickets-header-text">Ticket Purchase Information</div>
          <SlateGrayButton className="purchase-tickets-close-button" onClick={() =>this.props.closeModal()}>Close</SlateGrayButton>
        </div>
        <div className="purchase-tickets-column">
          {this.renderSection(
            "Account",
            "This is the account that will purchase the tickets and receive the reward."
          )}
          {this.renderSection(
            "Number of tickets",
            "The number of tickets to attempt to purchase."
          )}
          {this.renderSection(
            "Ticket fee (DCR/kB)",
            "Tickets are entered into the voting pool by order of their fee. In times of demand, you will need to increase this value in order to have your tickets accepted. You can view current ticket fees here."
          )}
          {this.renderSection(
            "Ticket price",
            "The current price of a ticket as calculated by the network.  Changes every 144 Blocks."
          )}
          {this.renderSection(
            "Stake pool preference",
            "Automate setup with PoS pools. See below for more information."
          )}
          {this.renderSection(
            "Expiry (blocks)",
            "Often ticket fees will increase during a window and you may be stopped out by higher fees. By setting an expiry, tickets that are not mined in the given number of blocks are cancelled so you can try again with higher fees if you wish. If this is empty, they will not expire until the end of the window."
          )}
        </div>
        <div className="purchase-tickets-column">
          {this.renderSection(
            "Tx fee (DCR/kB)",
            "Decrediton uses a \"split\" transaction to avoid blocking your balance, spliting the exact amount needed for the ticket from the balance in your wallet. The \"split\" transaction needs to be confirmed at least once before you can reuse your balance. This can block your whole balance for several minutes while this confirmation occurs. Without the split, you would have to wait for the confirmation of the ticket transaction, which could take several hours. This can be left at 0.01. It does not affect your chances of buying tickets or voting with them."
          )}
          {this.renderSection(
            "Voting address",
            "The Decred address that will do the voting."
          )}
          {this.renderSection(
            "Pool fee address",
            "The address that your stakepool fee will end up getting paid."
          )}
          {this.renderSection(
            "Pool fees (%)",
            "The fee in which you will be charged for using the stakepool's service."
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

export default PurchaseTicketsInfo;
