import { LogsTab } from "views/HelpPage/LogsTab";
import { Tooltip } from "shared";
import { GoBackMsg } from "../messages";

export default ({ onSendBack }) => (
  <>
    <div className="go-back-screen-button-area">
      <Tooltip text={<GoBackMsg />}>
        <div className="go-back-screen-button" onClick={onSendBack} />
      </Tooltip>
    </div>
    <div className="log-container">
      <LogsTab />
    </div>
  </>
);
