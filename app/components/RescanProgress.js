import React from "react";
import LinearProgress from "material-ui/LinearProgress";
import rescan from "../connectors/rescan";
import { FormattedMessage as T } from "react-intl";
import "../style/MiscComponents.less";

const RescanProgress = ({
  rescanEndBlock,
  rescanCurrentBlock,
  rescanPercentFinished
}) => (
  <div className="rescan-progress-area" >
    <T id="rescan.rescanning" m="Rescanning" />
    <LinearProgress
      mode="determinate"
      min={0}
      max={1}
      value={rescanCurrentBlock/rescanEndBlock}
    />
    <span className="rescan-progress-fraction">{rescanCurrentBlock}/{rescanEndBlock}</span>
    <span className="rescan-progress-percent">{rescanPercentFinished}%</span>
  </div>
);

export default rescan(RescanProgress);
