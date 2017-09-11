// @flow
import React from "react";
import Snackbar from "material-ui/Snackbar";
import Notification from "./Notification";
import "../../style/Header.less";
import WalletGray from "../../style/icons/wallet-gray.svg";
import TicketSmall from "../../style/icons/tickets-ticket.svg";
import PlusBig from "../../style/icons/plus-big.svg";
import MinusBig from "../../style/icons/minus-big.svg";

const snackbarStyles = {
  stake: {
    height: "78px",
    padding: "0px 50px",
    backgroundColor: "rgba(12, 30, 62, 0.5)",
    backgroundImage: `url(${TicketSmall})`,
    backgroundPosition: "15px 50%",
    backgroundSize: "20px",
    backgroundRepeat: "no-repeat",
  },
  receive: {
    height: "78px",
    padding: "0px 50px",
    backgroundColor: "rgba(12, 30, 62, 0.5)",
    backgroundImage: `url(${PlusBig})`,
    backgroundPosition: "15px 50%",
    backgroundSize: "20px",
    backgroundRepeat: "no-repeat",
  },
  send: {
    height: "78px",
    padding: "0px 50px",
    backgroundColor: "rgba(12, 30, 62, 0.5)",
    backgroundImage: `url(${MinusBig})`,
    backgroundPosition: "15px 50%",
    backgroundSize: "20px",
    backgroundRepeat: "no-repeat",
  },
  transfer: {
    height: "78px",
    padding: "0px 50px",
    backgroundColor: "rgba(12, 30, 62, 0.5)",
    backgroundImage: `url(${WalletGray})`,
    backgroundPosition: "15px 50%",
    backgroundSize: "20px",
    backgroundRepeat: "no-repeat",
  }
};

const snackbarBodyStyle = ({ type }) => ({
  "Ticket": snackbarStyles.stake,
  "Vote": snackbarStyles.stake,
  "Revoke": snackbarStyles.stake,
  "Receive": snackbarStyles.receive,
  "Send": snackbarStyles.send,
  "Transfer": snackbarStyles.transfer
})[type] || {};

const Header = ({
  headerTop,
  headerTitleOverview,
  headerMetaOverview,
  message,
  onDismissMessage,
  children
}) => (
  <div>
    <Snackbar
      className="snackbar"
      open={!!message}
      message={message ? <Notification {...message} /> : ""}
      autoHideDuration={4000}
      bodyStyle={snackbarBodyStyle(message || {})}
      onRequestClose={reason => reason !== "clickaway" ? onDismissMessage() : null}
    />
    <div className="header">
      <div className="header-top">{headerTop}</div>
      <div className="header-title-overview">{headerTitleOverview}</div>
      <div className="header-meta-overview">{headerMetaOverview}</div>
      {children}
    </div>
  </div>
);

export default Header;
