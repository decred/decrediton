// @flow
import { snackbar } from "connectors";
import ReactTimeout from "react-timeout";
import Notification from "./Notification";
import { TRANSACTION_DIR_SENT, TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERED
} from "wallet/service";
import "style/Snackbar.less";

const propTypes = {
  messages: PropTypes.array.isRequired,
  onDismissAllMessages: PropTypes.func.isRequired,
};

const snackbarClasses = ({ type }) => ({
  "Ticket": "snackbar snackbar-stake",
  "Vote": "snackbar snackbar-stake",
  "Revocation": "snackbar snackbar-stake",
  [TRANSACTION_DIR_RECEIVED]: "snackbar snackbar-receive",
  [TRANSACTION_DIR_SENT]: "snackbar snackbar-send",
  [TRANSACTION_DIR_TRANSFERED]: "snackbar snackbar-transfer",
  "Warning": "snackbar snackbar-warning",
  "Error": "snackbar snackbar-error",
  "Success": "snackbar snackbar-success",
})[type] || "snackbar";

@autobind
class Snackbar extends React.Component {

  constructor(props) {
    super(props);
    this.hideTimer = null;
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
      if (message) {
        if (this.hideTimer) {
          this.props.clearTimeout(this.hideTimer);
        }
        this.hideTimer = this.props.setTimeout(this.onDismissMessage, 4000);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.message !== nextState.message;
  }

  onDismissMessage() {
    const state = this.state;
    this.setState({ ...state, message: null });
    this.props.onDismissAllMessages();
    if (this.hideTimer) {
      this.props.clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  onRequestClose(reason) {
    if (reason !== "clickaway") {
      this.onDismissMessage();
    }
  }

  render() {
    const { message } = this.state;
    return (
      <div className={snackbarClasses(message || "")} >
        {message ? <Notification {...message} /> : ""}
      </div>
    );
  }
}

Snackbar.propTypes = propTypes;

export default ReactTimeout(snackbar(Snackbar));
