import { useState } from "react";
import ErrorScreen from "ErrorScreen";
import { useService } from "hooks";
import { useHomePage } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import { Balance, TabsHeader, Tooltip } from "shared";
import { StandalonePage } from "layout";
import RecentTransactions from "./RecentTransactions/RecentTransactions";
import RecentTickets from "./RecentTickets/RecentTickets";
import BalanceTab from "./Tabs/BalanceTab/BalanceTab";
import TicketsTab from "./Tabs/TicketsTab/TicketsTab";
import TransactionsTab from "./Tabs/TransactionsTab/TransactionsTab";
import { classNames } from "pi-ui";
import styles from "./HomePage.module.css";

const ROWS_NUMBER_ON_TABLE = 5;

const tabMessages = {
  balance: <T id="home.tab.balance" m="Balance" />,
  tickets: <T id="home.tab.tickets" m="Tickets" />,
  transactions: <T id="home.tab.transactions" m="Transactions" />
};

const withTooltip = (Component) => (
  <Tooltip text={Component}>{Component}</Tooltip>
);

const tabs = [
  {
    label: withTooltip(tabMessages.balance),
    component: <BalanceTab />,
    icon: styles.balanceIcon
  },
  {
    label: withTooltip(tabMessages.tickets),
    component: <TicketsTab />,
    icon: styles.ticketsIcon
  },
  {
    label: withTooltip(tabMessages.transactions),
    component: <TransactionsTab />,
    icon: styles.txIcon
  }
];

export default () => {
  const { walletService } = useService();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

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
    <StandalonePage>
      <div className={classNames(styles.overviewHeader, styles.isRow)}>
        <Balance
          classNameWrapper={styles.overviewBalance}
          classNameUnit={styles.overviewBalanceUnit}
          amount={totalBalance}
        />
        <div className={styles.overviewBalanceLabel}>
          <T id="home.currentTotalBalanceLabel" m="Current Total Balance" />
        </div>
      </div>
      <TabsHeader
        {...{
          tabs,
          setActiveTabIndex,
          activeTabIndex,
          contentClassName: styles.tabsContent,
          tabsWrapperClassName: styles.tabsWrapper
        }}
      />
      <div
        className={classNames(styles.overviewTransactionsTicket, styles.isRow)}>
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
  ) : (
    <ErrorScreen />
  );
};
