import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import { TransactionChart } from "charts";
import { useTransactions } from "./hooks";
import { classNames } from "pi-ui";
import sharedStyles from "../../HomePage.module.css";
import GovernanceNotification from "../../GovernanceNotification";

const TransactionsTab = () => {
  const { balanceReceived, balanceSent, sentAndReceivedTransactions } =
    useTransactions();
  return (
    <div className={sharedStyles.overviewContentWrapper}>
      <div className={sharedStyles.overviewLeftWrapper}>
        <GovernanceNotification />
        <div className={sharedStyles.overviewSpendableLockedWrapper}>
          <div className={sharedStyles.overviewSpendableLockedWrapperArea}>
            <Balance
              classNameWrapper={classNames(
                sharedStyles.overviewBalanceSpendableLocked,
                sharedStyles.received,
                sharedStyles.amount
              )}
              amount={balanceReceived}
            />
            <div className={sharedStyles.overviewBalanceSpendableLockedLabel}>
              <T id="home.receivedBalanceLabel" m="Received" />
            </div>
          </div>
          <div className={sharedStyles.overviewSpendableLockedWrapperArea}>
            <Balance
              classNameWrapper={classNames(
                sharedStyles.overviewBalanceSpendableLocked,
                sharedStyles.sent,
                sharedStyles.amount
              )}
              amount={balanceSent}
            />
            <div className={sharedStyles.overviewBalanceSpendableLockedLabel}>
              <T id="home.sentBalanceLabel" m="Sent" />
            </div>
          </div>
        </div>
      </div>
      <TransactionChart data={sentAndReceivedTransactions} />
    </div>
  );
};

export default TransactionsTab;
