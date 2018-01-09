// @flow
import { rescan, home } from "connectors";
import { DecredLoading } from "indicators";
import { Balance, TabbedHeader } from "shared";
import TxHistory from "TxHistory";
import { FormattedMessage as T } from "react-intl";
import "style/Fonts.less";
import "style/HomePage.less";

const HomePage = ({
  routes,
  spendableTotalBalance,
  totalBalance,
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse,
  ...props
}) => {
  return (
    <div className="overview-wrapper">
      <div className="overview-header-wrapper">
        <Balance className="overview-balance" amount={totalBalance} />
      </div>
      <div className="recent-transactions"></div>
      <div className="ticket-activity"></div>
    </div>
  );
};

export default home(rescan(HomePage));

/*
  This is the transaction search button that needs to get implemented
  <div style={HomeStyles.contentTitleButtonSearch}></div>

*/
