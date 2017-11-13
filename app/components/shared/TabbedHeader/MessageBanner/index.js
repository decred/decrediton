import { messageBanner } from "connectors";
import { FormattedMessage as T } from "react-intl";
import Message from "./Message";

const MessageBanner = ({
  synced,
}) => {
  return (
    !synced ?
    <div className="notification not-synced">
      <T id="home.notSyncedInfo" m="The wallet is not fully synced yet. Note: Balances will not be accurate until syncing is complete." />
    </div> :
    <Message />
  );
};

export default messageBanner(MessageBanner);
