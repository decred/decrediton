import Header from "../DefaultHeader";
import { SlateGrayButton } from "buttons";
import { FormattedMessage as T } from "react-intl";

export default ({
  startupError,
  onHideLogs
}) => (
  <Header
    headerTop={startupError
      ? <div key="pubError" className="get-started-view-notification-error">{startupError}</div>
      : <div key="pubError" ></div>}
    headerMetaOverview={(
      <div className="get-started-create-wallet-header">
        <div className="get-started-subheader">
          <T id="getStarted.header.logs.meta" m="Logs" />
        </div>
        <div className="get-started-button-toolbar">
          <SlateGrayButton
            className="get-started-view-button-go-back"
            onClick={onHideLogs}
          ><T id="getStarted.logs.backBtn" m="Back" /> </SlateGrayButton>
        </div>
      </div>
    )}
  />
);
