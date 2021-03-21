import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import { classNames } from "pi-ui";
import styles from "./BalanceHeader.module.css";

const BalanceHeader = ({ channelBalances }) => (
  <div className={styles.balanceHeader}>
    <div
      className={classNames(
        styles.balanceTile,
        channelBalances.maxInboundAmount === 0
          ? styles.zeroFunds
          : styles.hasInbound
      )}>
      <div className={styles.balanceValue}>
        <Balance amount={channelBalances.maxInboundAmount} />
      </div>
      <T id="ln.invoicesTab.balance.maxReceivable" m="Max. Receivable" />
    </div>
  </div>
);

export default BalanceHeader;
