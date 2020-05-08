import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import { TransactionChart } from "charts";
import { transactionsHome } from "connectors";
import "style/HomePage.less";

const HomePage = ({
  balanceReceived,
  balanceSent,
  sentAndReceivedTransactions
}) => {
  return (
    <div className="overview-content-wrapper">
      <div className="overview-spendable-locked-wrapper">
        <div className="overview-spendable-locked-wrapper-area">
          <Balance
            classNameWrapper="overview-balance-spendable-locked received amount"
            classNameUnit="overview-balance-spendable-locked-unit"
            amount={balanceReceived}
          />
          <div className="overview-balance-spendable-locked-label">
            <T id="home.receivedBalanceLabel" m="Received" />
          </div>
        </div>
        <div className="overview-spendable-locked-wrapper-area">
          <Balance
            classNameWrapper="overview-balance-spendable-locked sent amount"
            classNameUnit="overview-balance-spendable-locked-unit"
            amount={balanceSent}
          />
          <div className="overview-balance-spendable-locked-label">
            <T id="home.sentBalanceLabel" m="Sent" />
          </div>
        </div>
      </div>
      <div className="overview-chart-wrapper">
        <TransactionChart data={sentAndReceivedTransactions} />
      </div>
    </div>
  );
};

export default transactionsHome(HomePage);
