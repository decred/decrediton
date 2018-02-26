import { FormattedMessage as T } from "react-intl";
import "style/GetStarted.less";

export const FetchBlockHeadersFormBody = ({
  showLongWaitMessage
}) => {
  return showLongWaitMessage &&
    <T id="getStarted.firstTimeSyncDelayReminder" m="If you are syncing the blockchain for the first time, this may take a while." />;
};
