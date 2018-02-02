import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/Fonts.less";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";
import "style/HomePage.less";

const HomePage = ({
  spendableTotalBalance,
  lockedTotalBalance,
  balanceChartData
}) => {
  return (
    <div className="overview-content-wrapper">
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
      <div>
        <BarChart width={400} height={244} data={balanceChartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="7 7" />
          <Tooltip />
          <Legend />
          <Bar dataKey="spendable" stackId="a" fill="#0c1e3e" />
          <Bar dataKey="locked" stackId="a" fill="#2971ff" />
        </BarChart>
      </div>
    </div>
  );
};

export default HomePage;

/*
  This is the transaction search button that needs to get implemented
  <div style={HomeStyles.contentTitleButtonSearch}></div>

*/
