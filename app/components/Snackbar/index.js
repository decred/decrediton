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
      messages: new Array()
    };
  }

  componentWillReceiveProps(nextProps) {
    const message = nextProps.messages.length > 0
      ? nextProps.messages[nextProps.messages.length-1]
      : null;
    if(!message) {
      return;
    }
    const messages = nextProps.messages;
    this.enableHideTimer();
    if(this.checkIfMessageHasShown(message, this.props.messages)) {
      return;
    } else {
      this.setState({ ...this.state, messages });
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
    console.log("clearTImer!");
    this.clearHideTimer();
    this.hideTimer = this.props.setTimeout(this.onDismissMessage, 10000);
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
    const messages = [];//state.messages;
    var newMessages = messages;
    newMessages.pop();
    this.setState({ ...state, messages: newMessages });
    // dismiss single message of the one popped
    //this.props.onDismissAllMessages();
    this.clearHideTimer();
  }

  getStaticNotification() {
    const { message } = this.state;
    const { onDismissMessage } = this;
    return (
      <div
        className={snackbarClasses(message || "")}
        onMouseEnter={this.clearHideTimer}
        onMouseLeave={this.enableHideTimer}
        style={{ bottom: "0px" }}
      >
        {message ? <Notification  {...{ onDismissMessage, message }} /> : ""}
      </div>
    );
  }

  notifWillEnter() {
    return { bottom: -10 };
  }

  getAnimatedNotification() {
    const { messages } = this.state;
    const { onDismissMessage } = this;
    var notifications = new Array();
    for (var i = 0; i < messages.length; i++) {
      const key = "ntf"+Math.random();
      const styles = [ {
        key: key+i,
        data: messages[i],
        style: { backgroundColor:  i == messages.length ? "#fff" : "inherit", bottom: spring(i * 74, theme("springs.tab")) }
      } ];
      const notification = <TransitionMotion key={key} styles={styles} willEnter={this.notifWillEnter}>
        { is => !is[0].data
          ? ""
          : <div
            key={is[0].key}
            className={snackbarClasses(is[0].data || "")}
            onMouseEnter={is[0].bottom ? this.clearHideTimer : null }
            onMouseLeave={is[0].bottom ? this.enableHideTimer : null }
            style={is[0].style}
          >
            <Notification {...{ onDismissMessage, ...is[0].data }} />
          </div>
        }
      </TransitionMotion>;
      notifications.push(notification);
      console.log(i, snackbarClasses(messages[i] || ""));
    }
    console.log(notifications);
    return notifications;
  }

  render() {
    const notification = this.props.uiAnimations
      ? this.getAnimatedNotification()
      : this.getStaticNotification();

    return (
      <EventListener target="document" >
        {notification}
      </EventListener>
    );
  }
}

Snackbar.propTypes = propTypes;

export default ReactTimeout(snackbar(theming(Snackbar)));
