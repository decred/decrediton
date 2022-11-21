import styles from "./NoDevicePage.module.css";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";

const NoDevicePage = ({ onConnect }) => {
  return (
    <div className={styles.container}>
      <div className={styles.desc}>
        <T
          id="trezor.noDevice.message"
          m="No Trezor is detected. Connect the Device and check if Trezor bridge is installed and running on latest firmware."
        />
      </div>
      <KeyBlueButton onClick={onConnect} className={styles.button}>
        <T id="trezor.noDevice.btnConnect" m="Connect to Trezor" />
      </KeyBlueButton>
    </div>
  );
};

export default NoDevicePage;
