import { FormattedMessage as T } from "react-intl";
import { EnableExternalRequestButton } from "buttons";
import { EXTERNALREQUEST_POLITEIA } from "main_dev/externalRequests";

export default () => (
  <div>
    <p><T id="proposals.enablePoliteia.description" m="Politeia integration is currently disabled in your privacy settings. Please enable it if you want to be able to access the proposal system." /></p>
    <EnableExternalRequestButton requestType={EXTERNALREQUEST_POLITEIA}>
      <T id="proposals.enablePoliteia.button" m="Enable Politeia Integration" />
    </EnableExternalRequestButton>
  </div>
);
