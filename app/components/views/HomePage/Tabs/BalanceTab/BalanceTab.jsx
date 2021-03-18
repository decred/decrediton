import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import { BalanceChart } from "charts";
import { useBalance } from "./hooks";
import { Tooltip, classNames } from "pi-ui";
import styles from "../../HomePage.module.css";

const BalanceTab = () => {
  const {
    spendableTotalBalance,
    lockedTotalBalance,
    spendableAndLockedBalance,
    unconfirmedTotalBalance,
    lockedByTicketsTotalBalance,
    immatureRewardTotalBalance,
    immatureStakeGenerationTotalBalance,
    votingAuthorityTotalBalance
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
        <Tooltip
          content={
            <div className={styles.lockedBalanceTooltipGrid}>
              <T id="home.immatureRewardBalanceLabel" m="Immature Rewards" />:
              <Balance
                classNameWrapper={classNames(
                  styles.overviewBalanceSpendableLocked,
                  styles.amount
                )}
                amount={immatureRewardTotalBalance}
              />
              <T
                id="home.lockedByTicketsTotalBalanceLabel"
                m="Locked by tickets"
              />
              :
              <Balance
                classNameWrapper={classNames(
                  styles.overviewBalanceSpendableLocked,
                  styles.amount
                )}
                amount={lockedByTicketsTotalBalance}
              />
              <T id="home.votingAuthorityBalanceLabel" m="Voting Authority" />:
              <Balance
                classNameWrapper={classNames(
                  styles.overviewBalanceSpendableLocked,
                  styles.amount
                )}
                amount={votingAuthorityTotalBalance}
              />
              <T
                id="home.immatureStakeGenerationBalanceLabel"
                m="Immature Stake Gen"
              />
              :
              <Balance
                classNameWrapper={classNames(
                  styles.overviewBalanceSpendableLocked,
                  styles.amount
                )}
                amount={immatureStakeGenerationTotalBalance}
              />
              <T
                id="home.currentTotalUnconfirmedBalanceLabel"
                m="Unconfirmed"
              />
              :
              <Balance
                classNameWrapper={classNames(
                  styles.overviewBalanceSpendableLocked,
                  styles.amount
                )}
                amount={unconfirmedTotalBalance}
              />
            </div>
          }>
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
        </Tooltip>
      </div>
      <BalanceChart data={spendableAndLockedBalance} />
    </div>
  );
};

export default BalanceTab;
