import { useWatchOnlyWarnNotification } from "./hooks";
import { defineMessages } from "react-intl";

const messages = defineMessages({
  watchOnlyWarn: {
    id: "watchOnly.warn",
    defaultMessage: "This functionality is disabled for watch-only Wallets"
  }
});

const WatchOnlyWarnNotification = ({ children, isActive }) => {
  const { dispatchSingleMessage } = useWatchOnlyWarnNotification();
  return (
    <span
      onClick={
        isActive ? () => dispatchSingleMessage(messages.watchOnlyWarn) : null
      }>
      {children}
    </span>
  );
};

export default WatchOnlyWarnNotification;
