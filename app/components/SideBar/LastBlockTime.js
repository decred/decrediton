import { FormattedMessage as T } from "react-intl";
import ReactTimeout from "react-timeout";
import { FormattedRelative } from "shared";
import { useLastBlockTime } from "./hooks";

function LastBlockTime({ lastBlockTimestamp, clearTimeout, setTimeout }) {
  const { state } = useLastBlockTime(lastBlockTimestamp, clearTimeout, setTimeout);

  return state && state.lastBlockDate ?
    state.lastBlockIsRecent ?
      <T id="sidebar.lastBlockIsRecent" m="< 1 minute ago" /> :
      <FormattedRelative value={state.lastBlockDate} updateInterval={1 * 1000} />
    : null;

}

export { LastBlockTime };

export default ReactTimeout(LastBlockTime);
