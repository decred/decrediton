// @flow
import Snackbar from "material-ui/Snackbar";
import Notification from "./Notification";
import "style/Header.less";
import "style/Snackbar.less";

const snackbarClasses = ({ type }) => ({
  "Ticket": "snackbar snackbar-stake",
  "Vote": "snackbar snackbar-stake",
  "Revoke": "snackbar snackbar-stake",
  "Receive": "snackbar snackbar-receive",
  "Send": "snackbar snackbar-send",
  "Transfer": "snackbar snackbar-transfer"
})[type] || "snackbar ";

const Header = ({
  headerTop,
  headerTitleOverview,
  headerMetaOverview,
  message,
  onDismissMessage,
  children
}) => (
  <Aux>
    <Snackbar
      className={snackbarClasses(message || "")}
      open={!!message}
      message={message ? <Notification {...message} /> : ""}
      autoHideDuration={4000}
      bodyStyle={{backgroundColor: "inherited"}}
      onRequestClose={reason => reason !== "clickaway" ? onDismissMessage() : null}
    />
    <div className="header">
      <div className="header-top">{headerTop}</div>
      <div className="header-title-overview">{headerTitleOverview}</div>
      <div className="header-meta-overview">{headerMetaOverview}</div>
      {children}
    </div>
  </Aux>
);

export default Header;
