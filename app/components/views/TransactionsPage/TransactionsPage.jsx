import { TabbedPage, TabbedPageTab as Tab, TitleHeader } from "layout";
import { Switch, Redirect } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import { default as SendTab, SendTabHeader } from "./SendTab/SendTab";
import {
  default as ReceiveTab,
  ReceiveTabHeader
} from "./ReceiveTab/ReceiveTab";
import {
  default as HistoryTab,
  HistoryTabHeader
} from "./HistoryTab/HistoryTab";
import { default as ExportTab, ExportTabHeader } from "./ExportTab/ExportTab";
import { TRANSACTIONS_ICON } from "constants";

const PageHeader = () => (
  <TitleHeader
    iconType={TRANSACTIONS_ICON}
    title={<T id="transactions.title" m="Transactions" />}
  />
);

export default () => (
  <TabbedPage header={<PageHeader />}>
    <Switch>
      <Redirect from="/transactions" exact to="/transactions/send" />
    </Switch>
    <Tab
      path="/transactions/send"
      component={SendTab}
      header={SendTabHeader}
      link={<T id="transactions.tab.send" m="Send" />}
    />
    <Tab
      path="/transactions/receive"
      component={ReceiveTab}
      header={ReceiveTabHeader}
      link={<T id="transactions.tab.receive" m="Receive" />}
    />
    <Tab
      path="/transactions/history"
      component={HistoryTab}
      header={HistoryTabHeader}
      link={<T id="transactions.tab.history" m="History" />}
    />
    <Tab
      path="/transactions/export"
      component={ExportTab}
      header={ExportTabHeader}
      link={<T id="transactions.tab.export" m="Export" />}
    />
  </TabbedPage>
);
