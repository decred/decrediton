import { snackbar } from "connectors"
import { defineMessages } from "react-intl";

const messages = defineMessages({
  watchOnlyWarn: {
    id: "watchOnly.warn",
    defaultMessage: "This functionality is disabled for watch-only Wallets"
  },
});

const WatchOnlyWarnNotification = ({ dispatchSingleMessage, children, isActive }) => (
  <div onClick={isActive ? () => dispatchSingleMessage(messages.watchOnlyWarn) : null}>
    {children}
  </div>
)

export default snackbar(WatchOnlyWarnNotification);
