import React from "react";
import LinearProgress from "material-ui/LinearProgress";
import rescan from "../../../connectors/rescan";
import "../../../style/HomePage.less";

const RescanProgress = ({
  rescanStartBlock,
  rescanEndBlock,
  rescanCurrentBlock,
  rescanPercentFinished
}) => (
  <div className="home-rescan-progress-area" >
    <LinearProgress
      mode="determinate"
      min={rescanStartBlock}
      max={rescanEndBlock}
      value={rescanCurrentBlock}
    />
    <span className="home-rescan-progress-fraction">{rescanCurrentBlock}/{rescanEndBlock}</span>
    <span className="home-rescan-progress-percent">{rescanPercentFinished}%</span>
  </div>
);

export default rescan(RescanProgress);
