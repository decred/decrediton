import { Tooltip } from "pi-ui";
import { LogsTab } from "views/SettingsPage/LogsTab/LogsTab";
import { GoBackMsg } from "../messages";
import { BackButton, BackButtonArea } from "../helpers";

export default ({ onSendBack }) => (
  <>
    <BackButtonArea>
      <Tooltip content={<GoBackMsg />}>
        <BackButton onClick={onSendBack} />
      </Tooltip>
    </BackButtonArea>
    <div>
      <LogsTab />
    </div>
  </>
);
