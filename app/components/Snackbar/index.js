// @flow
import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import snackbar from "../../connectors/snackbar";
import MUISnackbar from "material-ui/Snackbar";
import Notification from "./Notification";

const propTypes = {
  messages: PropTypes.array.isRequired,
  onDismissAllMessages: PropTypes.func.isRequired,
};

const snackbarClasses = ({ type }) => ({
  "Ticket": "snackbar snackbar-stake",
  "Vote": "snackbar snackbar-stake",
  "Revoke": "snackbar snackbar-stake",
  "Receive": "snackbar snackbar-receive",
  "Send": "snackbar snackbar-send",
  "Transfer": "snackbar snackbar-transfer",
  "Warning": "snackbar snackbar-warning",
  "Error": "snackbar snackbar-error",
  "Success": "snackbar snackbar-success",
})[type] || "snackbar";

@autobind
class Snackbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: props.messages.length > 0
        ? props.messages[props.messages.length-1]
        : null
    };
  }

  componentWillReceiveProps(nextProps) {
    const message = nextProps.messages.length > 0
      ? nextProps.messages[nextProps.messages.length-1]
      : null;
    if (message !== this.state.message) {
      const state = this.state;
      this.setState({ ...state, message });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.message !== nextState.message;
  }

  onDismissMessage() {
    const state = this.state;
    this.setState({ ...state, message: null });
    this.props.onDismissAllMessages();
  }

  onRequestClose(reason) {
    if (reason !== "clickaway") {
      this.onDismissMessage();
    }
  }

  render() {
    const { message } = this.state;
    return (
      <MUISnackbar
        className={snackbarClasses(message || "")}
        open={!!message}
        message={message ? <Notification {...message} /> : ""}
        autoHideDuration={4000}
        bodyStyle={{backgroundColor: "inherited", fontFamily: null,
          lineHeight: null, height: null}}
        style={{fontFamily: null, lineHeight: null}}
        onRequestClose={this.onRequestClose}
      />
    );
  }
}

Snackbar.propTypes = propTypes;

export default snackbar(Snackbar);
