// @flow
import EventListener from "react-event-listener";
import { useSnackbar } from "./hooks";
import Notification from "./Notification";
import theme from "theme";
import { spring, TransitionMotion } from "react-motion";
import {
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TICKET_FEE,
  TICKET,
  VOTE,
  REVOCATION
} from "constants/Decrediton";
import { classNames } from "pi-ui";
import style from "./Snackbar.module.css";

const snackbarClasses = ({ type }) =>
  ({
    [TICKET]: classNames(
      style.snackbar,
      style.snackbarTxMixin,
      style.snackbarStake
    ),
    [VOTE]: classNames(
      style.snackbar,
      style.snackbarTxMixin,
      style.snackbarStake
    ),
    [REVOCATION]: classNames(
      style.snackbar,
      style.snackbarTxMixin,
      style.snackbarStake
    ),
    [TRANSACTION_DIR_RECEIVED]: classNames(
      style.snackbar,
      style.snackbarTxMixin,
      style.snackbarReceive
    ),
    [TRANSACTION_DIR_SENT]: classNames(
      style.snackbar,
      style.snackbarTxMixin,
      style.snackbarSend
    ),
    [TICKET_FEE]: classNames(
      style.snackbar,
      style.snackbarTxMixin,
      style.snackbarTicketfee
    ),
    Warning: classNames(style.snackbar, style.snackbarWarning),
    Error: classNames(style.snackbar, style.snackbarError),
    Success: classNames(style.snackbar, style.snackbarSuccess)
  }[type] || "snackbar");

const Snackbar = () => {
  const {
    uiAnimations,
    messages,
    setMessages,
    progress,
    clearHideTimer,
    enableHideTimer,
    onDismissMessage
  } = useSnackbar();

  function getStaticNotification() {
    const notifications = new Array();
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const notification = (
        <div
          key={"ntf" + i}
          className={snackbarClasses(message || "")}
          onMouseEnter={clearHideTimer}
          onMouseLeave={enableHideTimer}
          style={{ bottom: "0px" }}>
          <Notification
            {...{
              topNotification: i === 0,
              progress,
              onDismissMessage,
              ...message
            }}
          />
        </div>
      );
      notifications.push(notification);
    }
    return notifications;
  }

  function notifWillEnter() {
    return { bottom: -10 };
  }

  function animatedNotifRef(key, ref) {
    if (!ref) return;
    const height = ref.clientHeight;
    let changedHeight = false;
    const newMessages = messages.map((m) => {
      if (m.key !== key) return m;
      if (m.height === height) return m;
      changedHeight = true;
      return { ...m, height };
    });
    if (!changedHeight) return;
    setMessages(newMessages);
  }

  function getAnimatedNotification() {
    const styles = [];

    let totalHeight = 0;
    for (let i = messages.length - 1; i >= 0; i--) {
      styles.unshift({
        key: messages[i].key,
        data: messages[i],
        style: {
          bottom: spring(
            20 + (messages.length - i - 1) * 20 + totalHeight,
            theme("springs.tab")
          )
        }
      });
      totalHeight += messages[i].height || 64;
    }

    return (
      <TransitionMotion styles={styles} willEnter={notifWillEnter}>
        {(is) => (
          <>
            {" "}
            {is.map((s, i) => {
              return (
                <div
                  key={s.key}
                  className={snackbarClasses(s.data || "")}
                  onMouseEnter={clearHideTimer}
                  onMouseLeave={enableHideTimer}
                  style={s.style}
                  ref={(ref) => animatedNotifRef(s.key, ref)}>
                  <Notification
                    {...{
                      topNotification: i === 0,
                      progress,
                      onDismissMessage,
                      ...s.data
                    }}
                  />
                </div>
              );
            })}{" "}
          </>
        )}
      </TransitionMotion>
    );
  }

  const notification = uiAnimations
    ? getAnimatedNotification()
    : getStaticNotification();

  return (
    <EventListener target="document">
      <div className={style.snackbarPanel}>{notification}</div>
    </EventListener>
  );
};

export default Snackbar;
