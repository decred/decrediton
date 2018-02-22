import { LogsTab } from "views/HelpPage/LogsTab";
import { FormattedMessage as T } from "react-intl";
import { SlateGrayButton } from "buttons";

export default ({ onHideLogs }) => (
  <div className="page-body getstarted">
    <div className="getstarted content">
      <LogsTab />
      <SlateGrayButton
        className="get-started-view-button-go-back"
        onClick={onHideLogs}
      ><T id="getStarted.logs.backBtn" m="Back" /> </SlateGrayButton>
    </div>
  </div>
);
