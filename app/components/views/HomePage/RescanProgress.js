import React from "react";
import LinearProgress from "material-ui/LinearProgress";
import { HomeStyles } from "../ViewStyles";
import rescan from "../../../connectors/rescan";

const RescanProgress = ({
  rescanStartBlock,
  rescanEndBlock,
  rescanCurrentBlock,
  rescanPercentFinished
}) => (
  <div style={HomeStyles.rescanProgressArea} >
    <LinearProgress
      mode="determinate"
      min={rescanStartBlock}
      max={rescanEndBlock}
      value={rescanCurrentBlock}
    />
    <span style={HomeStyles.rescanProgressFraction}>{rescanCurrentBlock}/{rescanEndBlock}</span>
    <span style={HomeStyles.rescanProgressPercent}>{rescanPercentFinished}%</span>
  </div>
);

export default rescan(RescanProgress);
