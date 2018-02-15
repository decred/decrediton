import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";

const rescanBtnMessage = "Cancel rescan";

export default ({ rescanRequest, rescanCancel }) => (
  <Tooltip text={ <T id="sidebar.rescanCancelBtn.tip" m={rescanBtnMessage} /> } disabled={ !rescanRequest }>
    <button
      disabled={!rescanRequest}
      className={"rescan-cancel-button"}
      onClick={() => rescanCancel()} />
  </Tooltip>
);
