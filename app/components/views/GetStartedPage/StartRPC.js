import React from "react";
import Header from "../../Header";
import ShowError from "../../ShowError";
import KeyBlueButton from "../../KeyBlueButton";
import { FormattedMessage as T } from "react-intl";
import "../../../style/GetStarted.less";

export const StartRPCHeader = () => (
  <Header getStarted
    headerTitleOverview={<T id="getStarted.header.title" m="Setting up Decrediton" />}
    headerMetaOverview={<T id="getStarted.header.startRpc.meta" m="Starting RPC and subscribing block notifications" />} />
);

export const StartRPCBody = ({
  startupError,
  onRetryStartRPC
}) => (
  startupError ? (
    <div className="get-started-content-new-seed page-content">
      <ShowError className="get-started-error" error="Connection to dcrd failed, please try and reconnect." />
      <KeyBlueButton className="get-started-rpc-retry-button" onClick={onRetryStartRPC}>
        <T id="getStarted.retryBtn" m="Retry" />
      </KeyBlueButton>
    </div>
  ) : null
);
