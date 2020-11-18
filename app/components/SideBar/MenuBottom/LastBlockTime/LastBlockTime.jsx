import { FormattedMessage as T } from "react-intl";
import { FormattedRelative } from "shared";
import ReactTimeout from "react-timeout";
import { useLastBlockTime } from "./hooks";

const LastBlockTime = ({ lastBlockTimestamp, clearTimeout, setTimeout }) => {
  const { lastBlockDate, lastBlockIsRecent } = useLastBlockTime(
    lastBlockTimestamp,
    clearTimeout,
    setTimeout
  );

  return lastBlockDate ? (
    <>
      <span>{", "}</span>
      {lastBlockIsRecent ? (
        <T id="sidebar.lastBlockIsRecent" m="1 min ago" />
      ) : (
        <FormattedRelative value={lastBlockDate} updateInterval={1 * 1000} />
      )}
    </>
  ) : null;
};

export { LastBlockTime };

export default ReactTimeout(LastBlockTime);
