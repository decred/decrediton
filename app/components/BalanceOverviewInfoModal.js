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
    width: "600px",
    float: "left",
    color: "#fff",
    fontSize: "13px",
    lineHeight: "14px",
  }
};
class BalanceOverviewInfoModal extends React.Component {
  render() {
    return (
      <div style={styles.modal}>
        <div style={styles.modalSectionTicketPurchaseInformation}>
          <div style={styles.modalSubSectionHeadingTicketPurchaseInformation}>
            Balance Overview Information
            <SlateGrayButton style={styles.ticketPurchaseInformationButton} onClick={() =>this.props.closeModal()}>Close</SlateGrayButton>
          </div>
          <p style={styles.ticketPurchaseInformationTextColumn}><span style={styles.highlightTextNeonGreen}>Total</span> - This is the total balance controlled by this account currently.
            <br/>
            <br/>
            <span style={styles.highlightTextSkyBlue}>Spendable Balance</span> - The spendable/accessible balance for the this account.
            <br/>
            <br/>
            <span style={styles.highlightTextSkyBlue}>Locked By Tickets</span> - This is the balance that is currently locked by tickets for this account. Once the tickets are voted or revoked these funds will be unlocked.
            <br/>
            <br/>
            <span style={styles.highlightTextSkyBlue}>Voting Authority</span> - This balance shows the total amount that this account has voting authority over.  For example, if you use a voting-only wallet this will show that total amount controlled.
            <br/>
            <br/>
            <span style={styles.highlightTextSkyBlue}>Immature Rewards</span> - These are regular coinbase rewards that are currently maturing (from PoW mining reward for instance).
            <br/>
            <br/>
            <span style={styles.highlightTextSkyBlue}>Immature Stake Generation </span>- This balance shows the current stake rewards and revocations that are awaiting maturity (256 blocks on mainnet).</p>
            <br/>
            <br/>
        </div>
      </div>);
  }
}

export default BalanceOverviewInfoModal;