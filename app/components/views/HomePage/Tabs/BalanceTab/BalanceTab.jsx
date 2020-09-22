import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import { BalanceChart } from "charts";
import { useBalance } from "./hooks";
import { classNames } from "pi-ui";
import styles from "../../HomePage.module.css";

const BalanceTab = () => {
  const {
    spendableTotalBalance,
    lockedTotalBalance,
    spendableAndLockedBalance
  } = useBalance();
  return (
    <div className={styles.overviewContentWrapper}>
      <div className={styles.overviewSpendableLockedWrapper}>
        <div className={styles.overviewSpendableLockedWrapperArea}>
          <Balance
            classNameWrapper={classNames(
              styles.overviewBalanceSpendableLocked,
              styles.available,
              styles.amount
            )}
            amount={spendableTotalBalance}
          />
          <div className={styles.overviewBalanceSpendableLockedLabel}>
            <T id="home.currentTotalSpendableBalanceLabel" m="Available" />
          </div>
        </div>
        <div className={styles.overviewSpendableLockedWrapperArea}>
          <Balance
            classNameWrapper={classNames(
              styles.overviewBalanceSpendableLocked,
              styles.locked,
              styles.amount
            )}
            amount={lockedTotalBalance}
          />
          <div className={styles.overviewBalanceSpendableLockedLabel}>
            <T id="home.currentTotalLockedBalanceLabel" m="Locked" />
          </div>
        </div>
      </div>
      <BalanceChart data={spendableAndLockedBalance} />
    </div>
  );
};

export default BalanceTab;
