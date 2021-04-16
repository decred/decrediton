import { Tooltip } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { Subtitle } from "shared";
import { GoBackMsg } from "../messages";
import styles from "../GetStarted.module.css";
import { BackButton } from "../helpers";

export default ({ children, onSendBack }) => (
  <>
    <div className={styles.goBackScreenButtonArea}>
      <Tooltip content={<GoBackMsg />}>
        <BackButton onClick={onSendBack} />
      </Tooltip>
    </div>
    <Subtitle title={<T id="settings.trezorConfig" m="Trezor Config" />} />
    <div className={styles.trezorConfigSections}>{children}</div>
  </>
);
