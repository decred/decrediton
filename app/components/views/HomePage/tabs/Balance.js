import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import { BalanceChart } from "charts";
import { balanceHome } from "connectors";
import "style/HomePage.less";

const HomePage = ({
  spendableTotalBalance,
  lockedTotalBalance,
  spendableAndLockedBalance
}) => {
  return (
    <div className="overview-content-wrapper">
      <div className="overview-spendable-locked-wrapper">
        <div className="overview-spendable-locked-wrapper-area">
          <Balance
            classNameWrapper="overview-balance-spendable-locked available amount"
            classNameUnit="overview-balance-spendable-locked-unit"
            amount={spendableTotalBalance}
          />
          <div className="overview-balance-spendable-locked-label">
            <T id="home.currentTotalSpendableBalanceLabel" m="Available" />
          </div>
        </div>
        <div className="overview-spendable-locked-wrapper-area">
          <Balance
            classNameWrapper="overview-balance-spendable-locked locked amount"
            classNameUnit="overview-balance-spendable-locked-unit"
            amount={lockedTotalBalance}
          />
          <div className="overview-balance-spendable-locked-label">
            <T id="home.currentTotalLockedBalanceLabel" m="Locked" />
          </div>
        </div>
      </div>
      <div className="overview-chart-wrapper">
        <BalanceChart data={spendableAndLockedBalance} />
      </div>
    </div>
  );
};

export default balanceHome(HomePage);
