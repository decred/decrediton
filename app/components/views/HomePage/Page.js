// @flow
import { rescan, home } from "connectors";
import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import RecentTransactions from "./RecentTransactions";
import TicketActivity from "./TicketActivity";
import "style/Fonts.less";
import "style/HomePage.less";
import {TabbedComponent} from "shared";
import BalanceTab from "./Balance";
import HomeHeader from "./HomeHeader";

const HomePage = ({
  routes,
  spendableTotalBalance,
  lockedTotalBalance,
  totalBalance,
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse,
  children,
}) => {
  return (
    <div className="overview-wrapper">
      <TabbedComponent differentHeader={HomeHeader} {...{routes}}>
        {children}
      </TabbedComponent>
      {console.log(routes)}
      <div className="overview-transactions-ticket-wrapper">
        <div className="recent-transactions">
          <RecentTransactions {...{ routes, spendableTotalBalance, transactions, getTransactionsRequestAttempt, getAccountsResponse }} />
        </div>
        <div className="ticket-activity">
          <TicketActivity {...{ routes, spendableTotalBalance, transactions, getTransactionsRequestAttempt, getAccountsResponse }} />
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
