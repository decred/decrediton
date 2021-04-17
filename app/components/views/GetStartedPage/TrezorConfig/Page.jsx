import { Tooltip } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { Subtitle } from "shared";
import { GoBackMsg } from "../messages";
import styles from "../GetStarted.module.css";
import { BackButton, BackButtonArea } from "../helpers";

export default ({ children, onSendBack }) => (
  <>
    <BackButtonArea>
      <Tooltip content={<GoBackMsg />}>
        <BackButton onClick={onSendBack} />
      </Tooltip>
    </BackButtonArea>
    <Subtitle title={<T id="settings.trezorConfig" m="Trezor Config" />} />
    <div className={styles.trezorConfigSections}>{children}</div>
  </>
);
