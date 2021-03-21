import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import { classNames } from "pi-ui";
import styles from "./BalanceHeader.module.css";

const BalanceHeader = ({ walletBalance, totalBandwidth }) => (
  <div className={styles.balanceHeader}>
    <div
      className={classNames(
        styles.balanceTile,
        walletBalance === 0 ? styles.zeroFunds : styles.hasFunds
      )}>
      <div className={styles.balanceValue}>
        <Balance amount={walletBalance} />
      </div>
      <T id="ln.channelsTab.balance.onChain" m="Confirmed on-chain balance" />
    </div>
    <div
      className={classNames(
        styles.balanceTile,
        totalBandwidth === 0 ? styles.zeroFunds : styles.hasFunds
      )}>
      <div className={styles.balanceValue}>
        <Balance amount={totalBandwidth} />
      </div>
      <T
        id="ln.channelsTab.balance.channelsCapacity"
        m="Total channels capacity"
      />
    </div>
  </div>
);

export default BalanceHeader;
