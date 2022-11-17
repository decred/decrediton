import { useWalletError } from "./hooks";
import styles from "./WalletError.module.css";

const WalletError = () => {
  const { getNetworkError } = useWalletError();
  return (
    <div className={styles.view}>
      <div className={styles.content}>
        {getNetworkError ? (
          <p>
            {getNetworkError} Please verify that your dcrd is configured
            correctly and restart.
          </p>
        ) : (
          <p>
            We have detected that your wallet has disconnected. Please reload
            Decrediton to fix this problem.
          </p>
        )}
      </div>
    </div>
  );
};

export default WalletError;
