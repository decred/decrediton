import { KeyBlueButton } from "buttons";
import { ShowError } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/GetStarted.less";

export const StartRPCBody = ({
  startupError,
  onRetryStartRPC
}) => (
  startupError &&
    <Aux>
      <ShowError className="get-started-error" error="Connection to dcrd failed, please try and reconnect." />
      <KeyBlueButton className="get-started-rpc-retry-button" onClick={onRetryStartRPC}>
        <T id="getStarted.retryBtn" m="Retry" />
      </KeyBlueButton>
    </Aux>
);
