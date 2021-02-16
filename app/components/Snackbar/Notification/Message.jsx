// @flow
import { injectIntl } from "react-intl";
import { ProgressRing } from "indicators";
import style from "../Snackbar.module.css";

const Message = ({
  intl,
  message,
  values,
  onDismissMessage,
  progress,
  topNotification
}) => {
  const txt = intl.formatMessage(message, values);
  return (
    <div className={style.snackbarMessage} data-testid="snackbar-message">
      {topNotification && (
        <button
          aria-label="Close"
          className={style.snackbarCloseButtonTop}
          onClick={onDismissMessage}>
          <ProgressRing radius={13} stroke={2} progress={progress} />
        </button>
      )}
      {txt}
    </div>
  );
};

export default injectIntl(Message);
