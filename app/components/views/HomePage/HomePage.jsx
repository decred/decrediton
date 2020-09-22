import ErrorScreen from "ErrorScreen";
import { useService } from "hooks";
import { useHomePage } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import { Balance, RoutedTab, Tooltip } from "shared";
import { StandalonePage } from "layout";
import RoutedTabsHeader from "shared/RoutedTabsHeader/RoutedTabsHeader";
import { Switch, Route, Redirect } from "react-router-dom";
import RecentTransactions from "./RecentTransactions/RecentTransactions";
import RecentTickets from "./RecentTickets/RecentTickets";
import BalanceTab from "./Tabs/BalanceTab/BalanceTab";
import TicketsTab from "./Tabs/TicketsTab/TicketsTab";
import TransactionsTab from "./Tabs/TransactionsTab/TransactionsTab";
import { classNames } from "pi-ui";
import styles from "./HomePage.module.css";

const ROWS_NUMBER_ON_TABLE = 5;

const tabMessages = [
  <T id="home.tab.balance" m="Balance" />,
  <T id="home.tab.tickets" m="Tickets" />,
  <T id="home.tab.transactions" m="Transactions" />
];

const tabLink = (i) => {
  const m = [
    <Tooltip text={tabMessages[i]}>
      <span className={classNames(
        styles.overviewTab,
        styles.balance
      )} />
      <span className={styles.overviewTabLabel}>{tabMessages[i]}</span>
    </Tooltip>,
    <Tooltip text={tabMessages[i]}>
      <span className={classNames(
        styles.overviewTab,
        styles.tickets
      )} />
      <span className={styles.overviewTabLabel}>{tabMessages[i]}</span>
    </Tooltip>,
    <Tooltip text={tabMessages[i]}>
      <span className={classNames(
        styles.overviewTab,
        styles.tx
      )} />
      <span className={styles.overviewTabLabel}>{tabMessages[i]}</span>
    </Tooltip>
  ];
  return m[i];
};

export default () => {
  const { walletService } = useService();

  const {
    tickets,
    totalBalance,
    transactions,
    getAccountsResponse,
    getTransactionsRequestAttempt,
    goToTransactionHistory,
    goToMyTickets,
    tsDate
  } = useHomePage();

  return walletService ? (
    <>
    <StandalonePage>
      <div className={classNames(
        styles.overviewHeader,
        styles.isRow
      )}>
        <div className={styles.overviewHeaderWrapper}>
          <div>
            <Balance
              classNameWrapper={styles.overviewBalance}
              classNameUnit={styles.overviewBalanceUnit}
              amount={totalBalance}
            />
            <div className={styles.overviewBalanceLabel}>
              <T id="home.currentTotalBalanceLabel" m="Current Total Balance" />
            </div>
          </div>

          <RoutedTabsHeader
            tabs={[
              RoutedTab("/home/balance", tabLink(0)),
              RoutedTab("/home/tickets", tabLink(1)),
              RoutedTab("/home/transactions", tabLink(2))
            ]}
            styles={styles}
          />
        </div>
      </div>

      <Switch>
        <Route path="/home/balance" component={BalanceTab} />
        <Route path="/home/tickets" component={TicketsTab} />
        <Route path="/home/transactions" component={TransactionsTab} />
        <Redirect from="/home" exact to="/home/balance" />
      </Switch>

      <div className={classNames(
        styles.overviewTransactionsTicket,
        styles.isRow
      )}>
        <RecentTransactions
          {...{
            transactions,
            getTransactionsRequestAttempt,
            getAccountsResponse,
            rowNumber: ROWS_NUMBER_ON_TABLE,
            goToTransactionHistory,
            tsDate
          }}
        />
        <RecentTickets
          {...{
            tickets,
            getTransactionsRequestAttempt,
            getAccountsResponse,
            rowNumber: ROWS_NUMBER_ON_TABLE,
            goToMyTickets,
            tsDate
          }}
        />
      </div>
      </StandalonePage>
    </>
  ) : <ErrorScreen />;
};
