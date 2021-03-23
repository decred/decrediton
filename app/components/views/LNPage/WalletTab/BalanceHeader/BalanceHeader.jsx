import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import styles from "./BalanceHeader.module.css";
import { classNames } from "pi-ui";

const BalanceHeader = ({
  confirmedBalance,
  unconfirmedBalance,
  totalBalance
}) => (
  <div className={styles.balanceHeader}>
    <div
      className={classNames(
        styles.balanceTile,
        confirmedBalance === 0 ? styles.zeroFunds : styles.hasFunds
      )}>
      <div className={styles.balanceValue}>
        <Balance amount={confirmedBalance} />
      </div>
      <T id="ln.walletTab.balance.confirmed" m="Confirmed balance" />
    </div>
    <div className={classNames(styles.balanceTile, styles.unconfirmed)}>
      <div className={styles.balanceValue}>
        <Balance amount={unconfirmedBalance} />
      </div>
      <T id="ln.walletTab.balance.unconfirmed" m="Unconfirmed balance" />
    </div>
    <div
      className={classNames(
        styles.balanceTile,
        totalBalance === 0 && styles.zeroFunds
      )}>
      <div className={styles.balanceValue}>
        <Balance amount={totalBalance} />
      </div>
      <T id="ln.walletTab.balance.totalBalance" m="Total balance" />
    </div>
  </div>
);

export default BalanceHeader;
