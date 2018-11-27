// @flow
import { keyBy } from "fp";
import { snackbar, theming } from "connectors";
import ReactTimeout from "react-timeout";
import EventListener from "react-event-listener";
import Notification from "./Notification";
import theme from "theme";
import { eventOutsideComponent } from "helpers";
import { spring, TransitionMotion } from "react-motion";
import { TRANSACTION_DIR_SENT, TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERRED
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
  [TRANSACTION_DIR_TRANSFERRED]: "snackbar snackbar-transfer",
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
      messages: new Array(),
      progress: 0,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages === this.props.messages) {
      return;
    }
    if (this.props.messages.length > 0) {
      this.enableHideTimer();
    }

    const messagesByKey = keyBy(this.state.messages, "key");
    const messages = this.props.messages.map(m => messagesByKey[m.key] ? messagesByKey[m.key] : m);
    this.setState({ messages });
  }

  enableHideTimer() {
    this.clearHideTimer();
    // emulating progress
    this.hideTimer = this.props.setInterval(() => {
      this.setState({ progress: this.state.progress + 10 });
      if (this.state.progress >= 100) {
        this.onDismissMessage();
        if (this.props.messages.length === 0)
          this.clearHideTimer();
      }
    }, 500);
  }

  clearHideTimer() {
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
    const messages = [ ...this.props.messages ];
    messages.shift();
    this.setState({ progress: 0 });
    // dismiss single message of the one popped
    this.props.onDismissAllMessages(messages);
    if (messages.length > 0)
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
        <Notification  {...{ topNotification: i === 0, progress, onDismissMessage, ...message }} />
      </div>;
      notifications.push(notification);
    }
    return notifications;
  }

  notifWillEnter() {
    return { bottom: -10 };
  }

  animatedNotifRef(key, ref) {
    if (!ref) return;
    const height = ref.clientHeight;
    let changedHeight = false;
    const newMessages = this.state.messages.map(m => {
      if (m.key !== key) return m;
      if (m.height === height) return m;
      changedHeight = true;
      return { ...m, height };
    });
    if (!changedHeight) return;
    this.setState({ messages: newMessages });
  }

  getAnimatedNotification() {
    const { messages, progress } = this.state;
    const { onDismissMessage, clearHideTimer, enableHideTimer, notifWillEnter,
      animatedNotifRef } = this;

    const styles = [];

    let totalHeight = 0;
    for (var i = messages.length-1; i >= 0; i--) {
      styles.unshift({
        key: messages[i].key,
        data: messages[i],
        style: { bottom: spring(20 + (messages.length-i-1)*20 + totalHeight, theme("springs.tab")) }
      });
      totalHeight += messages[i].height || 64;
    }

    return (
      <TransitionMotion styles={styles} willEnter={notifWillEnter}>
        { is => (<> {is.map((s, i) => (
          <div
            key={s.key}
            className={snackbarClasses(s.data || "")}
            onMouseEnter={clearHideTimer}
            onMouseLeave={enableHideTimer}
            style={s.style}
            ref={ref => animatedNotifRef(s.key, ref)}
          >
            <Notification {...{ topNotification: i === 0, progress,
              onDismissMessage, ...s.data }} />
          </div>
        )) } </> ) }
      </TransitionMotion>
    );
  }

  render() {
    const notification = this.props.uiAnimations
      ? this.getAnimatedNotification()
      : this.getStaticNotification();

    return (
      <EventListener target="document" >
        <div className="snackbar-panel">
          {notification}
        </div>
      </EventListener>
    );
  }
}

Snackbar.propTypes = propTypes;

export default ReactTimeout(snackbar(theming(Snackbar)));
