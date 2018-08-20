import { snackbar } from "connectors";
import { defineMessages } from "react-intl";

const messages = defineMessages({
  watchOnlyWarn: {
    id: "watchOnly.warn",
    defaultMessage: "This functionality is disabled for watch-only Wallets"
  },
});

const WatchOnlyWarnNotification = ({ dispatchSingleMessage, children, isActive }) => (
  <span onClick={isActive ? () => dispatchSingleMessage(messages.watchOnlyWarn) : null}>
    {children}
  </span>
);

export default snackbar(WatchOnlyWarnNotification);
