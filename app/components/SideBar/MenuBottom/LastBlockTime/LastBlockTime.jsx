import { FormattedMessage as T } from "react-intl";
import ReactTimeout from "react-timeout";
import { FormattedRelative } from "shared";
import { useLastBlockTime } from "./hooks";

const LastBlockTime = ({ lastBlockTimestamp, clearTimeout, setTimeout }) => {
  const { lastBlockDate, lastBlockIsRecent } = useLastBlockTime(
    lastBlockTimestamp,
    clearTimeout,
    setTimeout
  );

  return lastBlockDate ? (
    lastBlockIsRecent ? (
      <T id="sidebar.lastBlockIsRecent" m="< 1 minute ago" />
    ) : (
      <FormattedRelative value={lastBlockDate} updateInterval={1 * 1000} />
    )
  ) : null;
}

export { LastBlockTime };

export default ReactTimeout(LastBlockTime);
