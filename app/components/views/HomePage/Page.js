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
  totalBalance,
  tickets,
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse,
  children,
}) => {
  return (
    <div className="overview-wrapper">
      <TabbedComponent header={HomeHeader} {...{routes, totalBalance}}>
        {children}
      </TabbedComponent>
      <div className="overview-transactions-ticket-wrapper">
        <div className={tickets.length > 0 ? "recent-transactions" : "recent-transactions-full"}>
          <RecentTransactions {...{ routes, transactions, getTransactionsRequestAttempt, getAccountsResponse }} />
        </div>
        {tickets.length > 0 &&
          <div className="recent-transactions">
            <TicketActivity {...{ routes, tickets, getTransactionsRequestAttempt, getAccountsResponse }} />
          </div>
        }
      </div>
    </div>
  );
};

export default rescan(HomePage);
