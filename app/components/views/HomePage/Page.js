// @flow
import { rescan } from "connectors";
import RecentTransactions from "./RecentTransactions";
import TicketActivity from "./TicketActivity";
import "style/Fonts.less";
import "style/HomePage.less";
import {TabbedComponent} from "shared";
import HomeHeader from "./HomeHeader";

const HomePage = ({
  routes,
  spendableTotalBalance,
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse,
  children,
  ...props,
}) => {
  return (
    <div className="overview-wrapper">
      <TabbedComponent header={HomeHeader} {...{routes, ...props}}>
        {children}
      </TabbedComponent>
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

export default rescan(HomePage);
