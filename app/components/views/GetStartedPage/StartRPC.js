import Header from "./DefaultHeader";
import { KeyBlueButton } from "buttons";
import { ShowError } from "shared";
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
  startupError &&
    <div className="get-started-content-new-seed page-content">
      <ShowError className="get-started-error" error="Connection to Hxd failed, please try and reconnect." />
      <KeyBlueButton className="get-started-rpc-retry-button" onClick={onRetryStartRPC}>
        <T id="getStarted.retryBtn" m="Retry" />
      </KeyBlueButton>
    </div>
);
