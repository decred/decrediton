import { Redirect } from "react-router-dom";
import { TabbedPage, TabbedPageTab as Tab, TitleHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { default as SendTab, SendTabHeader } from "./SendTab";
import { default as ReceiveTab, ReceiveTabHeader } from "./ReceiveTab";
import { default as HistoryTab, HistoryTabHeader } from "./HistoryTab";

const PageHeader = () =>
  <TitleHeader
    iconClassName="transactions"
    title={<T id="transactions.title" m="Transactions" />}
  />;

export default () => (
  <TabbedPage header={<PageHeader />} >
    <Tab path="/transactions/send" component={SendTab} header={SendTabHeader} link={<T id="transactions.tab.send" m="Send"/>}/>
    <Tab path="/transactions/receive" component={ReceiveTab} header={ReceiveTabHeader} link={<T id="transactions.tab.receive" m="Receive"/>}/>
    <Tab path="/transactions/history" component={HistoryTab} header={HistoryTabHeader} link={<T id="transactions.tab.history" m="History"/>}/>
    <Redirect from="/transactions" exact to="/transactions/send" />
  </TabbedPage>
);
