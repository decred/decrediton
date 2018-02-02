import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/Fonts.less";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";
import "style/HomePage.less";

const data = [
  { name: 'Page A', uv: 4000, female: 2400, male: 2400 },
  { name: 'Page B', uv: 3000, female: 1398, male: 2210 },
  { name: 'Page C', uv: 2000, female: 9800, male: 2290 },
  { name: 'Page D', uv: 2780, female: 3908, male: 2000 },
  { name: 'Page E', uv: 1890, female: 4800, male: 2181 },
  { name: 'Page F', uv: 2390, female: 3800, male: 2500 },
  { name: 'Page G', uv: 3490, female: 4300, male: 2100 },
];
const HomePage = ({
  spendableTotalBalance,
  lockedTotalBalance,
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
        <BarChart width={600} height={300} data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar dataKey="female" stackId="a" fill="#8884d8" />
          <Bar dataKey="male" stackId="a" fill="#82ca9d" />
          <Bar dataKey="uv" fill="#ffc658" />
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
