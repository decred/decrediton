import styles from "./NoDevicePage.module.css";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";

const NoDevicePage = ({ onConnect }) => (
  <div className={styles.container}>
    <div className={styles.desc}>
      <T
        id="ledger.noDevice.message"
        m="No Ledger is detected. Connect the Device and make sure it is unlocked, open to the decred app, and running on latest firmware."
      />
    </div>
    <KeyBlueButton onClick={onConnect} className={styles.button}>
      <T id="ledger.noDevice.btnConnect" m="Connect to Ledger" />
    </KeyBlueButton>
  </div>
);

export default NoDevicePage;
