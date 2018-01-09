// @flow
import { rescan, home } from "connectors";
import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import RecentTransactions from "./RecentTransactions";
import TicketActivity from "./TicketActivity";
import "style/Fonts.less";
import "style/HomePage.less";

const HomePage = ({
  routes,
  spendableTotalBalance,
  totalBalance,
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse,
}) => {
  return (
    <div className="overview-wrapper">
      <div className="overview-header-wrapper">
        <Balance
          classNameWrapper="overview-balance"
          classNameUnit="overview-balance-unit"
          amount={totalBalance} />
        <div className="overview-balance-label">
          <T id="home.currentTotalBalanceLabel" m="Current Total Balance" />
        </div>
      </div>
      <div className="overview-transactions-ticket-wrapper">
        <div className="recent-transactions">
          <RecentTransactions {...{routes, spendableTotalBalance, transactions, getTransactionsRequestAttempt, getAccountsResponse}}/>
        </div>
        <div className="ticket-activity">
          <TicketActivity {...{routes, spendableTotalBalance, transactions, getTransactionsRequestAttempt, getAccountsResponse}}/>
        </div>
      </div>
    </div>
  );
};

export default home(rescan(HomePage));

/*
  This is the transaction search button that needs to get implemented
  <div style={HomeStyles.contentTitleButtonSearch}></div>

*/
