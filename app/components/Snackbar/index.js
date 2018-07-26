// @flow
import { snackbar, theming } from "connectors";
import ReactTimeout from "react-timeout";
import EventListener from "react-event-listener";
import Notification from "./Notification";
import theme from "theme";
import { eventOutsideComponent } from "helpers";
import { spring, TransitionMotion } from "react-motion";
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
        : null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const message = nextProps.messages.length > 0
      ? nextProps.messages[nextProps.messages.length-1]
      : null;
    if(!message) {
      return;
    }

    this.enableHideTimer();
    if(this.checkIfMessageHasShown(message, this.props.messages)) {
      return;
    } else {
      this.setState({ ...this.state, message });
    }
  }

  checkIfMessageHasShown(message, messages) {
    let isSame = false;
    messages.forEach(m => {
      if (this.checkIsSameMessage(message, m)) {
        isSame = true;
        return;
      }
    });
    return isSame;
  }

  checkIsSameMessage(messageObj, oldMessageObj) {
    if (messageObj === oldMessageObj) {
      return true;
    }
    if (!messageObj || !oldMessageObj) {
      return false;
    }
    const { type, message } = messageObj;
    if (type !== oldMessageObj.type) {
      return false;
    }
    // message can be a FormattedMessage from react-intl or a transaction
    if (message.defaultMessage !== oldMessageObj.message.defaultMessage) {
      return false;
    }
    const { txHash } = message;
    const oldTxHash = oldMessageObj.message.txHash;
    if ( txHash !== oldTxHash) {
      return false;
    }

    return true;
  }

  enableHideTimer() {
    this.clearHideTimer();
    this.hideTimer = this.props.setTimeout(this.onDismissMessage, 4000);
  }

  clearHideTimer() {
    if (this.hideTimer) {
      this.props.clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  windowClicked(event) {
    if (!this.state.message) return;
    if (eventOutsideComponent(this, event.target)) {
      this.onDismissMessage();
    }
  }

  onDismissMessage() {
    const state = this.state;
    this.setState({ ...state, message: null });
    this.props.onDismissAllMessages();
    this.clearHideTimer();
  }

  getStaticNotification() {
    const { message } = this.state;
    return (
      <div
        className={snackbarClasses(message || "")}
        onMouseEnter={this.clearHideTimer}
        onMouseLeave={this.enableHideTimer}
        style={{ bottom: "0px" }}
      >
        {message ? <Notification {...message} /> : ""}
      </div>
    );
  }

  notifWillEnter() {
    return { bottom: -10 };
  }

  getAnimatedNotification() {
    const { message } = this.state;

    const styles = [ {
      key: "ntf"+Math.random(),
      data: message,
      style: { bottom: spring(0, theme("springs.tab")) }
    } ];

    return (
      <TransitionMotion styles={styles} willEnter={this.notifWillEnter}>
        { is => !is[0].data
          ? ""
          : <div
            className={snackbarClasses(message || "")}
            onMouseEnter={this.clearHideTimer}
            onMouseLeave={this.enableHideTimer}
            style={is[0].style}
          >
            <Notification {...is[0].data} />
          </div>
        }
      </TransitionMotion>
    );
  }

  render() {
    const notification = this.props.uiAnimations
      ? this.getAnimatedNotification()
      : this.getStaticNotification();

    return (
      <EventListener target="document" onMouseUp={this.windowClicked}>
        {notification}
      </EventListener>
    );
  }
}

Snackbar.propTypes = propTypes;

export default ReactTimeout(snackbar(theming(Snackbar)));
