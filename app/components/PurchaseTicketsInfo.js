// @flow
import React from "react";
import SlateGrayButton from "./SlateGrayButton";
import "../style/PurchaseTicketsInfo.less";

class PurchaseTicketsInfo extends React.Component {
  render() {
    return (
      <div className="modal">
        <div className="header">
          <div className="header-text">Ticket Purchase Information</div>
          <SlateGrayButton className="close-button" onClick={() =>this.props.closeModal()}>Close</SlateGrayButton>
        </div>
        <div className="column">
          {this.renderSection(
            "Account",
            "This is the account that will purchase the tickets and receive the reward."
          )}
          {this.renderSection(
            "Amount",
            "The number of tickets to purchase."
          )}
          {this.renderSection(
            "Ticket fee (DCR/kB)",
            "Tickets are entered into the voting pool by order of their fee. In times of demand, you will need to increase this value in order to have your tickets accepted. You can view current ticket fees here."
          )}
          {this.renderSection(
            "Ticket difficulty",
            "The current price of a ticket."
          )}
          {this.renderSection(
            "Blocks until retarget",
            "When this reaches 0, a new ticket price is calculated."
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
        <div className="column">
          {this.renderSection(
            "Split fee (DCR/kB)",
            "Paymetheus uses a \"split\" transaction to avoid blocking your balance, spliting the exact amount needed for the ticket from the balance in your wallet. The \"split\" transaction needs to be confirmed at least once before you can reuse your balance. This can block your whole balance for several minutes while this confirmation occurs. Without the split, you would have to wait for the confirmation of the ticket transaction, which could take several hours. This can be left at 0.01. It does not affect your chances of buying tickets or voting with them."
          )}
          {this.renderSection(
            "Voting address",
            "The Decred address that will do the voting. Solo and custom pool miners only."
          )}
          {this.renderSection(
            "Pool fee address",
            "For those using a custom pool."
          )}
          {this.renderSection(
            "Pool fees (%)",
            "For those using a custom pool."
          )}
        </div>
      </div>
    );
  }

  renderSection(header, text) {
    return (
      <div className="section">
        <span className="section-header">{header}</span> - {text}
      </div>
    );
  }

}

export default PurchaseTicketsInfo;
