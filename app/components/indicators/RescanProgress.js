import React from "react";
import LinearProgress from "material-ui/LinearProgress";
import rescan from "connectors/rescan";
import { FormattedMessage as T } from "react-intl";
import "style/MiscComponents.less";

const RescanProgress = ({
  rescanEndBlock,
  rescanCurrentBlock,
  rescanPercentFinished
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
    <T
      id="rescan.rescanning"
      m="Rescanning {blockProgress} ({progressPercent})"
      values={{
        blockProgress: (<span className="rescan-progress-fraction">{rescanCurrentBlock}/{rescanEndBlock}</span>),
        progressPercent:
          (<span className="rescan-progress-percent">
            <T id="rescan.progressPercent" m="{progress, number, percent}" values={{progress: rescanPercentFinished/100}} />
          </span>)
      }}
    />
  </div>
);

export default rescan(RescanProgress);
