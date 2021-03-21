import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import { classNames } from "pi-ui";
import styles from "./BalanceHeader.module.css";

const BalanceHeader = ({ channelBalances }) => (
  <div className={styles.balanceHeader}>
    <div
      className={classNames(
        styles.balanceTile,
        channelBalances.maxOutboundAmount === 0
          ? styles.zeroFunds
          : styles.hasOutbound
      )}>
      <div className={styles.balanceValue}>
        <Balance amount={channelBalances.maxOutboundAmount} />
      </div>
      <T id="ln.paymentsTab.balance.maxPayable" m="Max. Payable" />
    </div>
  </div>
);

export default BalanceHeader;
