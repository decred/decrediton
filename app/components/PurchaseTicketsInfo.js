// @flow
import React from "react";
import SlateGrayButton from "./SlateGrayButton";

const styles = {
  modal: {
    height: "556px",
  },
  modalSection: {
    backgroundColor: "#fff",
  },
  modalSectionTicketPurchaseInformation: {
    paddingTop: "71px",
    paddingBottom: "54px",
    paddingLeft: "100px",
    width: "100%",
    height: "auto",
    minHeight: "100%",
    backgroundColor: "rgba(12, 30, 62, .9)",
  },
  highlightTextSkyBlue: {
    color: "#69d5f7",
  },
  highlightTextNeonGreen: {
    color: "#2ed8a3",
  },
  ticketPurchaseInformationButton: {
    width: "80px",
    float: "right",
  },
  modalSubSectionHeadingTicketPurchaseInformation: {
    color: "#fff",
    fontSize: "19px",
    lineHeight: "18px",
    textTransform: "capitalize",
    minHeight: "50px",
    paddingRight: "160px",
  },
  ticketPurchaseInformationTextColumn: {
    width: "220px",
    paddingRight: "100px",
    float: "left",
    color: "#fff",
    fontSize: "11px",
    lineHeight: "14px",
  }
};
class PurchaseTicketInfo extends React.Component {
  render() {
    return (
      <div style={styles.modal}>
        <div style={styles.modalSectionTicketPurchaseInformation}>
          <div style={styles.modalSubSectionHeadingTicketPurchaseInformation}>
            Ticket Purchase Information
            <SlateGrayButton style={styles.ticketPurchaseInformationButton} onClick={() =>this.props.closeModal()}>Close</SlateGrayButton>
          </div>
          <p style={styles.ticketPurchaseInformationTextColumn}><span style={styles.highlightTextNeonGreen}>From: 'Source Account</span> - This is the account that will purchase the tickets and receive the reward.
            <br/>
            <br/>
            <span style={styles.highlightTextSkyBlue}>Amount</span> - The number of tickets to purchase.
            <br/>
            <br/>
            <span style={styles.highlightTextSkyBlue}>Ticket fee (DCR/kB)</span> - Tickets are entered into the voting pool by order of their fee. In times of demand, you will need to increase this value in order to have your tickets accepted. You can view current ticket fees here.
            <br/>
            <br/>
            <span style={styles.highlightTextSkyBlue}>Ticket difficulty</span> - The current price of a ticket.
            <br/> Blocks until retarget - When this reaches 0, a new ticket price is calculated.
            <br/>
            <br/>
            <span style={styles.highlightTextSkyBlue}>Stake pool preference</span> - Automate setup with PoS pools. See below for more information.
            <br/>
            <br/>
            <span style={styles.highlightTextSkyBlue}>Expiry (blocks) </span>- Often ticket fees will increase during a window and you may be stopped out by higher fees. By setting an expiry, tickets that are not mined in the given number of blocks are cancelled so you can try again with higher fees if you wish. If this is empty, they will not expire until the end of the window.</p>
          <p style={styles.ticketPurchaseInformationTextColumn}><span style={styles.highlightTextSkyBlue}>Split fee (DCR/kB)</span> - Paymetheus uses a “split” transaction to avoid blocking your balance, spliting the exact amount needed for the ticket from the balance in your wallet. The “split” transaction needs to be confirmed at least once before you can reuse your balance. This can block your whole balance for several minutes while this confirmation occurs. Without the split, you would have to wait for the confirmation of the ticket transaction, which could take several hours. This can be left at 0.01. It does not affect your chances of buying tickets or voting with them.
            <br/>
            <br/>
            <span style={styles.highlightTextSkyBlue}>Voting address</span> - The Decred address that will do the voting. Solo and custom pool miners only.
            <br/>
            <br/>
            <span style={styles.highlightTextSkyBlue}>Pool fee address</span> - For those using a custom pool.
            <br/>
            <br/>
            <span style={styles.highlightTextSkyBlue}>Pool fees (%)</span> - For those using a custom pool.</p>
        </div>
      </div>);
  }
}

export default PurchaseTicketInfo;
