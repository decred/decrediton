// @flow
import { rescan } from "connectors";
import { FormattedMessage as T } from "react-intl";
import { Balance, RoutedTabsHeader, RoutedTab } from "shared";
import { Switch, Route, Redirect } from "react-router-dom";
import RecentTransactions from "./tables/RecentTransactions";
import TicketActivity from "./tables/TicketActivity";
import BalanceTab from "./tabs/Balance";
import TicketsTab from "./tabs/Tickets";
import TransactionsTab from "./tabs/Transactions";
import "style/Fonts.less";
import "style/HomePage.less";

const HomePage = ({
  totalBalance,
  tickets,
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse,
  rowNumber
}) => {
  return (
    <Aux>
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

        <RoutedTabsHeader tabs={[
          RoutedTab("/home/balance", <T id="home.tab.balance" m="Balance" />),
          RoutedTab("/home/tickets", <T id="home.tab.tickets" m="Tickets" />),
          RoutedTab("/home/transactions", <T id="home.tab.transactions" m="Transactions" />),
        ]} />
      </div>

      <Switch>
        <Route path="/home/balance" component={BalanceTab} />
        <Route path="/home/tickets" component={TicketsTab} />
        <Route path="/home/transactions" component={TransactionsTab} />
        <Redirect from="/home" exact to="/home/balance" />
      </Switch>

      <div className="overview-transactions-ticket-wrapper">
        <div className={"recent-transactions"}>
          <RecentTransactions {...{ transactions, getTransactionsRequestAttempt, getAccountsResponse, rowNumber }} />
        </div>
        <div className="recent-transactions">
          <TicketActivity {...{ tickets, getTransactionsRequestAttempt, getAccountsResponse, rowNumber }} />
        </div>
      </div>
    </Aux>
  );
};

export default rescan(HomePage);
