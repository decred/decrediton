import Header from "./DefaultHeader";
import ShowError from "ShowError";
import KeyBlueButton from "KeyBlueButton";
import { FormattedMessage as T } from "react-intl";
import "style/GetStarted.less";

export const StartRPCHeader = () => (
  <Header
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
