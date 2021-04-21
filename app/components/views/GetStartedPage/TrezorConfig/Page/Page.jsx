import { Tooltip } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { Subtitle } from "shared";
import { GoBackMsg } from "../../messages";
import { BackButton, BackButtonArea } from "../../helpers";
import styles from "./Page.module.css";

const Page = ({ children, onSendBack }) => (
  <>
    <BackButtonArea>
      <Tooltip content={<GoBackMsg />}>
        <BackButton onClick={onSendBack} />
      </Tooltip>
    </BackButtonArea>
    <Subtitle title={<T id="settings.trezorConfig" m="Trezor Config" />} />
    <div className={styles.trezorConfig}>{children}</div>
  </>
);

export default Page;
