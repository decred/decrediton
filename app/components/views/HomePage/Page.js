// @flow
import { rescan } from "connectors";
import { FormattedMessage as T } from "react-intl";
import { Balance, RoutedTabsHeader, RoutedTab, Tooltip } from "shared";
import { Switch, Route, Redirect } from "react-router-dom";
import RecentTransactions from "./tables/RecentTransactions";
import TicketActivity from "./tables/TicketActivity";
import BalanceTab from "./tabs/Balance";
import TicketsTab from "./tabs/Tickets";
import TransactionsTab from "./tabs/Transactions";
import "style/Fonts.less";
import "style/HomePage.less";

const tabMessages = [
  <T id="home.tab.balance" m="Balance" />,
  <T id="home.tab.tickets" m="Tickets" />,
  <T id="home.tab.transactions" m="Transactions" />
];

const tabLink = (i) => {
  const m = [
    (
      <Tooltip text={tabMessages[i]}>
        <span className="overview-tab balance" />
        <span className="overview-tab-label">
          {tabMessages[i]}
        </span>
      </Tooltip>
    ),
    (
      <Tooltip text={tabMessages[i]}>
        <span className="overview-tab tickets" />
        <span className="overview-tab-label">
          {tabMessages[i]}
        </span>
      </Tooltip>
    ),
    (
      <Tooltip text={tabMessages[i]}>
        <span className="overview-tab tx" />
        <span className="overview-tab-label">
          {tabMessages[i]}
        </span>
      </Tooltip>
    )
  ];
  return m[i];
};

const HomePage = ({
  totalBalance,
  tickets,
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse,
  rowNumber
}) => {
  return (
    <>
      <div className="overview-header is-row">
        <div className="overview-header-wrapper">
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
            RoutedTab("/home/balance", tabLink(0)),
            RoutedTab("/home/tickets", tabLink(1)),
            RoutedTab("/home/transactions", tabLink(2))
          ]} />
        </div>
      </div>

      <Switch>
        <Route path="/home/balance" component={BalanceTab} />
        <Route path="/home/tickets" component={TicketsTab} />
        <Route path="/home/transactions" component={TransactionsTab} />
        <Redirect from="/home" exact to="/home/balance" />
      </Switch>

      <div className="overview-transactions-ticket is-row">
        <RecentTransactions {...{ transactions, getTransactionsRequestAttempt, getAccountsResponse, rowNumber }} />
        <TicketActivity {...{ tickets, getTransactionsRequestAttempt, getAccountsResponse, rowNumber }} />
      </div>
    </>
  );
};

export default rescan(HomePage);
