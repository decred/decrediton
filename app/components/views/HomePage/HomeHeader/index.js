import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import Tabs from "./Tabs";
import "style/Header.less";

const TabbedHeader = ({ routes, totalBalance }) => (
  <div className="overview-header">
    <div className="overview-balance-wrapper">
      <Balance
        classNameWrapper="overview-balance"
        classNameUnit="overview-balance-unit"
        amount={totalBalance} />
      <div className="overview-balance-label">
        <T id="home.currentTotalBalanceLabel" m="Current Total Balance" />
      </div>
    </div>
    <Tabs className="home-tab" {...{ routes }} />
  </div>
);

TabbedHeader.propTypes = {
  routes: PropTypes.array,
  isTestNet: PropTypes.bool,
};

export default TabbedHeader;
