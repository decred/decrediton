import { TabbedPage, TitleHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { ReceiveTab, ReceiveTabHeader } from "./ReceiveTab";
import { SendTab, SendTabHeader } from "./SendTab";
import { HistoryTab, HistoryTabHeader } from "./HistoryTab";
import { ExportTab, ExportTabHeader } from "./ExportTab";
import { TRANSACTIONS_ICON } from "constants";

const PageHeader = () => (
  <TitleHeader
    iconType={TRANSACTIONS_ICON}
    title={<T id="transactions.title" m="Transactions" />}
  />
);

const tabs = [
  {
    path: "/transactions/send",
    content: SendTab,
    header: SendTabHeader,
    label: <T id="transactions.tab.send" m="Send" />
  },
  {
    path: "/transactions/receive",
    content: ReceiveTab,
    header: ReceiveTabHeader,
    label: <T id="transactions.tab.receive" m="Receive" />
  },
  {
    path: "/transactions/history",
    content: HistoryTab,
    header: HistoryTabHeader,
    label: <T id="transactions.tab.history" m="History" />
  },
  {
    path: "/transactions/export",
    content: ExportTab,
    header: ExportTabHeader,
    label: <T id="transactions.tab.export" m="Export" />
  }
];

const TransactionsPage = () => (
  <TabbedPage header={<PageHeader />} tabs={tabs} />
);

export default TransactionsPage;
