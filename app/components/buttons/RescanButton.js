import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";

const rescanBtnMessage =
`Initiate a transaction rescan.

Rescanning may help resolve some balance errors.

Note: This scans the entire blockchain for transactions,
but does not re-download it.`;

export default ({ rescanRequest, rescanAttempt }) => (
  <Tooltip text={ <T id="sidebar.rescanBtn.tip" m={ rescanBtnMessage} /> } disabled={ rescanRequest }>
    <button
      disabled={!!rescanRequest}
      className={"rescan-button" + (rescanRequest ? " spin" : "")}
      onClick={() => rescanAttempt(0)} />
  </Tooltip>
);
