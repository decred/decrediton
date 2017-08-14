// @flow
import React from "react";
import Snackbar from "material-ui/Snackbar";
import Notification from "./Notification";
import styles from "./styles";

const snackbarBodyStyle = ({ type }) => ({
  "Ticket": styles.SnackbarContentStake,
  "Vote": styles.SnackbarContentStake,
  "Revoke": styles.SnackbarContentStake,
  "Receive": styles.SnackbarContentReceive,
  "Send": styles.SnackbarContentSend,
  "Transfer": styles.SnackbarContentTransfer
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
      style={styles.Snackbar}
      open={!!message}
      message={message ? <Notification {...message} /> : ""}
      autoHideDuration={4000}
      bodyStyle={snackbarBodyStyle(message || {})}
      onRequestClose={reason => reason !== "clickaway" ? onDismissMessage() : null}
    />
    <div style={styles.header}>
      <div style={styles.headerTop}>{headerTop}</div>
      <div style={styles.headerTitleOverview}>{headerTitleOverview}</div>
      <div style={styles.headerMetaOverview}>{headerMetaOverview}</div>
      {children}
    </div>
  </div>
);

export default Header;
