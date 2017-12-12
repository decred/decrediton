import Header from "../DefaultHeader";
import { FormattedMessage as T } from "react-intl";

export default ({
  startupError
}) => (
  <Header
    headerMetaOverview={<T id="getStarted.header.settings.meta" m="Settings" />}
    headerTop={startupError
      ? <div key="pubError" className="get-started-view-notification-error">{startupError}</div>
      : <div key="pubError" ></div>}
  />
);
