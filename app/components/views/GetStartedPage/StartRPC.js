import React from "react";
import Header from "../../Header";
import KeyBlueButton from "../../KeyBlueButton";
import "../../../style/GetStarted.less";

export const StartRPCHeader = ({
  startupError
}) => (
  <Header getStarted
    headerTitleOverview="Setting up Decrediton"
    headerMetaOverview="Starting RPC and subscribing block notifications"
    headerTop={startupError
      ? <div key="startRpcError" className="get-started-view-notification-error">{startupError}</div>
      : <div key="startRpcError" ></div>}
  />
);

export const StartRPCBody = ({
  isProcessing,
  onRetryStartRPC
}) => {
  return isProcessing ? null : (
    <div className="get-started-content-nest">
      <div className="get-started-rpc-retry-message">Connection to dcrd failed, please try and reconnect.</div>
      <KeyBlueButton className="get-started-rpc-retry-button" onClick={onRetryStartRPC}>Retry</KeyBlueButton>
    </div>
  );
};
