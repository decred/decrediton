import { FormattedMessage as T } from "react-intl";
import { StandalonePageBody } from "layout";
import { useInvalidRPC } from "./hooks";
import styles from "./InvalidRPCVersion.module.css";

const InvalidRPCVersion = () => {
  const { requiredWalletRPCVersion, walletRPCVersion } = useInvalidRPC();
  return (
    <StandalonePageBody>
      <div className={styles.invalidRPC}>
        <T
          id="invalidRPCVersion.info"
          m={`The API of the currently running wallet ({walletRPCVersion}) is not compatible with Decrediton (required version {requiredWalletRPCVersion}).

        Please update the daemon (dcrd) and wallet (dcrwallet) to the latest version, then try again.`}
          values={{ walletRPCVersion, requiredWalletRPCVersion }}
        />
      </div>
    </StandalonePageBody>
  );
};

export default InvalidRPCVersion;
