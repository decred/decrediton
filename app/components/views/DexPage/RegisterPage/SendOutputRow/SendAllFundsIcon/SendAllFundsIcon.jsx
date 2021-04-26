import { FormattedMessage as T } from "react-intl";
import styles from "./SendAllFundsIcon.module.css";
import { classNames, Tooltip } from "pi-ui";

const SendAllFundsIcon = ({
  isSendAll,
  onShowSendAll,
  onHideSendAll,
  outputs
}) => (
  <div className={styles.sendAllFundsIcon}>
    {outputs.length > 1 ? (
      <Tooltip
        contentClassName={styles.tooltipSendAllDisabled}
        content={
          <T
            id="send.dex.sendAllTitle.disabled"
            m="Send all funds from selected account - Disabled"
          />
        }>
        <a
          className={classNames(
            styles.sendIconWrapper,
            styles.walletIcon,
            styles.disabled
          )}
        />
      </Tooltip>
    ) : !isSendAll ? (
      <Tooltip
        contentClassName={styles.tooltipSendAll}
        content={
          <T
            id="send.dex.sendAllTitle"
            m="Send all funds from selected account"
          />
        }>
        <a
          className={classNames(styles.sendIconWrapper, styles.walletIcon)}
          onClick={onShowSendAll}
        />
      </Tooltip>
    ) : (
      <Tooltip
        contentClassName={styles.tooltipSendAll}
        content={
          <T id="send.dex.cancelSendAllTitle" m="Cancel sending all funds" />
        }>
        <a
          className={classNames(styles.sendIconWrapper, styles.cancelIcon)}
          onClick={onHideSendAll}
        />
      </Tooltip>
    )}
  </div>
);

export default SendAllFundsIcon;
