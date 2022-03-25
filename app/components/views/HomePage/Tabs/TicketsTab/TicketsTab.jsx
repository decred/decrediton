import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import { TicketChart } from "charts";
import { useTickets } from "./hooks";
import { classNames } from "pi-ui";
import sharedStyles from "../../HomePage.module.css";
import styles from "./TicketsTab.module.css";
import GovernanceNotification from "../../GovernanceNotification";

const TicketsTab = () => {
  const {
    totalValueOfLiveTickets,
    earnedStakingReward,
    activeTicketsCount,
    votedTicketsCount,
    ticketDataChart
  } = useTickets();

  return (
    <div className={sharedStyles.overviewContentWrapper}>
      <div className={sharedStyles.overviewLeftWrapper}>
        <GovernanceNotification />
        <div className={sharedStyles.overviewSpendableLockedWrapper}>
          <div
            className={classNames(
              sharedStyles.overviewSpendableLockedWrapperArea,
              sharedStyles.tickets
            )}>
            <div
              className={classNames(
                sharedStyles.overviewBalanceSpendableLocked,
                sharedStyles.active
              )}>
              <T
                id="home.activeTicketsCount"
                m="{count, plural, one {{fmtCount} active and locked ticket} other {{fmtCount} active and locked tickets}}"
                values={{
                  count: activeTicketsCount,
                  fmtCount: <span className="count">{activeTicketsCount}</span>
                }}
              />
            </div>
            <div className={styles.overviewBalanceSpendableLockedText}>
              <T
                id="home.totalValueOfActiveTickets"
                m="With a total value of {value}"
                values={{
                  value: (
                    <Balance
                      flat
                      classNameWrapper={classNames(
                        styles.headerSmallBalance,
                        styles.overviewBalanceSpendableLocked
                      )}
                      amount={totalValueOfLiveTickets}
                    />
                  )
                }}
              />
            </div>
          </div>
          <div className={sharedStyles.overviewSpendableLockedWrapperArea}>
            <div
              className={classNames(
                sharedStyles.overviewBalanceSpendableLocked,
                sharedStyles.voted
              )}>
              <T
                id="home.votedTicketsCount"
                m="{count, plural, one {{fmtCount} voted ticket} other {{fmtCount} voted tickets}}"
                values={{
                  count: votedTicketsCount,
                  fmtCount: <span className="count">{votedTicketsCount}</span>
                }}
              />
            </div>
            <div className={styles.overviewBalanceSpendableLockedText}>
              <T
                id="home.earned"
                m="Earned {value} in staking rewards"
                values={{
                  value: (
                    <Balance
                      flat
                      classNameWrapper={classNames(
                        styles.headerSmallBalance,
                        styles.overviewBalanceSpendableLocked
                      )}
                      amount={earnedStakingReward}
                    />
                  )
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <TicketChart data={ticketDataChart} />
    </div>
  );
};

export default TicketsTab;
