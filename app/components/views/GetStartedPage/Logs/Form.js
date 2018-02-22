import LogsTab from "views/HelpPage/LogsTab";
import { SlateGrayButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import "style/GetStarted.less";

export default ({
  onHideLogs
}) => (
  <div className="page-body getstarted">
    <div className="getstarted content">
      <LogsTab />

      <div className="get-started-bottom-buttons">
        <SlateGrayButton onClick={onHideLogs}>
          <T id="getStarted.btnHideSettings" m="Back" />
        </SlateGrayButton>
      </div>
    </div>
  </div>
);
