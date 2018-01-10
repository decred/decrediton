import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/Fonts.less";
import "style/HomePage.less";

const HomePage = ({
  spendableTotalBalance,
  lockedTotalBalance,
  totalBalance,
}) => {
  return (
    <div className="overview-header-wrapper">
      <Balance
        classNameWrapper="overview-balance"
        classNameUnit="overview-balance-unit"
        amount={totalBalance} />
      <div className="overview-balance-label">
        <T id="home.currentTotalBalanceLabel" m="Current Total Balance" />
      </div>
      <div className="overview-spendable-locked-wrapper">
        <div className="overview-spendable-locked">
          <Balance
            classNameWrapper="overview-balance-spendable-locked"
            classNameUnit="overview-balance-spendable-locked-unit"
            amount={spendableTotalBalance} />
          <div className="overview-balance-spendable-locked-label">
            <T id="home.currentTotalSpendableBalanceLabel" m="Available" />
          </div>
          <Balance
            classNameWrapper="overview-balance-spendable-locked"
            classNameUnit="overview-balance-spendable-locked-unit"
            amount={lockedTotalBalance} />
          <div className="overview-balance-spendable-locked-label">
            <T id="home.currentTotalLockedBalanceLabel" m="Locked" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

/*
  This is the transaction search button that needs to get implemented
  <div style={HomeStyles.contentTitleButtonSearch}></div>

*/
