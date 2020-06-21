import { Tooltip, Subtitle } from "shared";
import { FormattedMessage as T } from "react-intl";
import { GoBackMsg } from "../messages";
import styles from "../GetStarted.module.css";

export default ({ children, onSendBack }) => (
  <>
    <div className={styles.goBackScreenButtonArea}>
      <Tooltip text={<GoBackMsg />}>
        <div className={styles.goBackScreenButton} onClick={onSendBack} />
      </Tooltip>
    </div>
    <Subtitle title={<T id="settings.trezorConfig" m="Trezor Config" />} />
    <div className={styles.trezorConfigSections}>{children}</div>
  </>
);
