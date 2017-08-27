import React from "react";
import Header from "../../Header";
import DecredLoading from "../../DecredLoading";
import KeyBlueButton from "../../KeyBlueButton";
import "../../../style/GetStarted.less";

const StartRPC = ({
  startupError,
  isProcessing,
  onRetryStartRPC
}) => (
  <div className="get-started-view">
    <Header getStarted
      headerTitleOverview="Starting RPC and subscribing block notifications"
      headerTop={startupError
        ? <div key="startRpcError" className="get-started-view-notification-error">{startupError}</div>
        : <div key="startRpcError" ></div>}
    />
    <div className="get-started-content">
      <div className="get-started-content-nest">
        {isProcessing ? <DecredLoading/> : (
          <div>
            <div className="get-started-rpc-retry-message">Connection to dcrd failed, please try and reconnect.</div>
            <KeyBlueButton
              className="get-started-rpc-retry-button"
              onClick={onRetryStartRPC}
            >Retry</KeyBlueButton>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default StartRPC;
