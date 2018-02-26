import { FormattedMessage as T } from "react-intl";
import "style/GetStarted.less";

export const FetchBlockHeadersFormBody = ({
  showLongWaitMessage
}) => {
  return showLongWaitMessage &&
    <div className="get-started-fetch-headers-message">
      <T id="getStarted.firstTimeSyncDelayReminder" m="If you are syncing the blockchain for the first time, this may take a while." />
    </div>;
};
