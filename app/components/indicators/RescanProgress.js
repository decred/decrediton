import LinearProgress from "material-ui/LinearProgress";
import { rescan } from "connectors";
import { FormattedMessage as T } from "react-intl";
import { RescanButton, RescanCancelButton } from "buttons";
import "style/MiscComponents.less";

const RescanProgress = ({
  rescanEndBlock,
  rescanCurrentBlock,
  rescanPercentFinished,
  rescanRequest,
  rescanCancel,
}) => (
  <div className="rescan-progress-area" >
    <div className="rescan-progress-indicator">
      <LinearProgress
        mode="determinate"
        min={0}
        max={1}
        value={rescanCurrentBlock/rescanEndBlock}
        color="#2ed8a3"
      />
    </div>
    <div className="rescan-button-area">
      <RescanButton {...{ rescanRequest }} />
    </div>
    <T
      id="rescan.rescanning"
      m="Rescanning {blockProgress} ({progressPercent})"
      values={{
        blockProgress: (<span className="rescan-progress-fraction">{rescanCurrentBlock}/{rescanEndBlock}</span>),
        progressPercent:
          (<span className="rescan-progress-percent">
            <T id="rescan.progressPercent" m="{progress, number, percent}" values={{ progress: rescanPercentFinished/100 }} />
          </span>)
      }}
    />
    <div className="rescan-cancel-button-area">
      <RescanCancelButton {...{ rescanRequest, rescanCancel }} />
    </div>
  </div>
);

export default rescan(RescanProgress);
