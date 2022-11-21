import { FormattedMessage as T } from "react-intl";
import styles from "./TrezorLoaderBarContainer.module.css";
import { useTrezorLoaderBarContainer } from "./hooks";

const TrezorLoaderBarContainer = ({ loaderBar }) => {
  const { trezorDevice, deviceLabel } = useTrezorLoaderBarContainer();
  return trezorDevice ? (
    <div className={styles.loaderBarContainer}>
      <div className={styles.deviceStatus}>
        <span className={styles.deviceLabel}>
          <T
            id="trezorLoaderBarContainer.Connected"
            m="{label} Trezor"
            values={{
              label: deviceLabel ? (
                deviceLabel
              ) : (
                <T id="trezorLoaderBarContainer.deviceLabel" m="New DCR" />
              )
            }}
          />
        </span>
        <span> | </span>
        <span className={styles.connected}>
          <T id="trezorLoaderBarContainer.connected" m="Connected" />
        </span>
      </div>
      <div className={styles.loaderBar}>{loaderBar}</div>
    </div>
  ) : null;
};

export default TrezorLoaderBarContainer;
