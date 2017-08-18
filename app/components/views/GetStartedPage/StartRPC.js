import React from "react";
import { GetStartedStyles } from "../ViewStyles";
import Header from "../../Header";
import DecredLoading from "../../DecredLoading";
import KeyBlueButton from "../../KeyBlueButton";

const StartRPC = ({
  startupError,
  isProcessing,
  onRetryStartRPC
}) => (
  <div style={GetStartedStyles.view}>
    <Header getStarted
      headerTitleOverview="Starting RPC and subscribing block notifications"
      headerTop={startupError
        ? <div key="startRpcError" style={GetStartedStyles.viewNotificationError}>{startupError}</div>
        : <div key="startRpcError" ></div>}
    />
    <div style={GetStartedStyles.content}>
      <div style={GetStartedStyles.contentNest}>
        {isProcessing ? <DecredLoading/> : (
          <div>
            <div style={GetStartedStyles.rpcRetryMessage}>Connection to dcrd failed, please try and reconnect.</div>
            <KeyBlueButton
              style={GetStartedStyles.rpcRetryButton}
              onClick={onRetryStartRPC}
            >Retry</KeyBlueButton>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default StartRPC;
