import { FormattedMessage as T } from "react-intl";
import { EnableExternalRequestButton } from "buttons";
import { EXTERNALREQUEST_POLITEIA } from "constants";
import styles from "./ProposalsTab.module.css";

export default ({ getTokenAndInitialBatch }) => (
  <div className={styles.politeiaDisabled}>
    <p className={styles.politeiaDisabledMsg}>
      <T
        id="proposals.enablePoliteia.description"
        m="Politeia integration is disabled by privacy settings. It must be enabled to access the proposal system."
      />
    </p>
    <EnableExternalRequestButton
      requestType={EXTERNALREQUEST_POLITEIA}
      onClick={getTokenAndInitialBatch}>
      <T id="proposals.enablePoliteia.button" m="Enable Politeia Integration" />
    </EnableExternalRequestButton>
  </div>
);
