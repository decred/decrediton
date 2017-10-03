import React from "react";
import Header from "../../Header";
import ShowError from "../../ShowError";
import KeyBlueButton from "../../KeyBlueButton";
import { FormattedMessage } from "react-intl";
import "../../../style/GetStarted.less";

export const StartRPCHeader = () => (
  <Header getStarted
    headerTitleOverview={<FormattedMessage id="getStarted.header.title" defaultMessage="Setting up Decrediton" />}
    headerMetaOverview={<FormattedMessage id="getStarted.header.startRpc.meta" defaultMessage="Starting RPC and subscribing block notifications" />} />
);

export const StartRPCBody = ({
  startupError,
  onRetryStartRPC
}) => (
  startupError ? (
    <div className="get-started-content-new-seed page-content">
      <ShowError className="get-started-error" error="Connection to dcrd failed, please try and reconnect." />
      <KeyBlueButton className="get-started-rpc-retry-button" onClick={onRetryStartRPC}>
        <FormattedMessage id="getStarted.retryBtn" defaultMessage="Retry" />
      </KeyBlueButton>
    </div>
  ) : null
);
