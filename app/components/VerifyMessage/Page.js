import React from "react";
import "../../style/StakePool.less";

const VerifyMessagePage = () => (
  <div className="stakepool-content-voting-gui page-content">
    <div className="stakepool-voting-title-area">
      <div className="stakepool-voting-title-area-name">Verify Message</div>
      <div className="stakepool-unconfigured-select">
        Address: <input type="text" />
        Message: <textarea>TEST</textarea>
        <button type="submit">Verify</button>
      </div>
    </div>
  </div>
);

export default VerifyMessagePage;
