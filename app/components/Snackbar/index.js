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
      messages: new Array(),
      progress: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const message = nextProps.messages.length > 0
      ? nextProps.messages[nextProps.messages.length-1]
      : null;
    if(!message) {
      return;
    }
    const { messages } = this.state;
    this.enableHideTimer();
    if(this.checkIfMessageHasShown(message, messages)) {
      return;
    } else {
      var newMessages = messages;
      newMessages.push(message);
      this.setState({ ...this.state, messages: newMessages });
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
    // emulating progress
    this.hideTimer = setInterval(() => {
      this.setState({ progress: this.state.progress + 10 });
      if (this.state.progress >= 100) {
        this.onDismissMessage();
        if (this.state.messages.length === 0)
          this.clearHideTimer();
      }
    }, 500);
  }

  clearHideTimer() {
    this.setState({ progress: 0 });
    if (this.hideTimer) {
      this.props.clearInterval(this.hideTimer);
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
    const messages = this.state.messages;
    var newMessages = messages;
    newMessages.pop();
    this.setState({ ...state, messages: newMessages });
    // dismiss single message of the one popped
    this.props.onDismissAllMessages(newMessages);
    if (newMessages.length > 0)
      this.enableHideTimer();
  }

  getStaticNotification() {
    const { messages, progress } = this.state;
    const { onDismissMessage, clearHideTimer, enableHideTimer } = this;
    var notifications = new Array();
    for (var i = 0; i < messages.length; i++) {
      const message = messages[i];
      const notification =
      <div
        key={"ntf" + i }
        className={snackbarClasses(message || "")}
        onMouseEnter={clearHideTimer}
        onMouseLeave={enableHideTimer}
        style={{ bottom: "0px" }}>
        <Notification  {...{ topNotification: i == messages.length - 1, progress, onDismissMessage, ...message }} />
      </div>;
      notifications.push(notification);
    }
    return notifications;
  }

  notifWillEnter() {
    return { bottom: -10 };
  }

  getAnimatedNotification() {
    const { messages, progress } = this.state;
    const { onDismissMessage, clearHideTimer, enableHideTimer, notifWillEnter } = this;
    var notifications = new Array();
    for (var i = 0; i < messages.length; i++) {
      const key = "ntf"+Math.random();
      const styles = [ {
        key: key+i,
        data: messages[i],
        style: { bottom: spring(20, theme("springs.tab")) }
      } ];
      const notification = <TransitionMotion key={key} styles={styles} willEnter={notifWillEnter}>
        { is => !is[0].data
          ? ""
          : <div
            key={is[0].key}
            className={snackbarClasses(is[0].data || "")}
            onMouseEnter={clearHideTimer}
            onMouseLeave={enableHideTimer}
            style={is[0].style}
          >
            <Notification {...{ topNotification: i == messages.length - 1, progress, onDismissMessage, ...is[0].data }} />
          </div>
        }
      </TransitionMotion>;
      notifications.push(notification);
    }
    return notifications;
  }

  render() {
    const notification = !this.props.uiAnimations
      ? this.getAnimatedNotification()
      : this.getStaticNotification();

    return (
      <EventListener target="document" >
        {notification.length > 0 &&
          <div className="snackbar-panel">
            {notification}
          </div>
        }
      </EventListener>
    );
  }
}

Snackbar.propTypes = propTypes;

export default ReactTimeout(snackbar(theming(Snackbar)));
