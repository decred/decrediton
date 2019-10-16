import { TabbedPage, TabbedPageTab as Tab, TitleHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { Switch, Redirect } from "react-router-dom";
import { lnPage } from "connectors";
import LNConnectPage from "./ConnectPage";
import { default as WalletTab, WalletTabHeader } from "./WalletTab";
import { default as ChannelsTab, ChannelsTabHeader } from "./ChannelsTab";
import { default as InvoicesTab, InvoicesTabHeader } from "./InvoicesTab";
import { default as PaymentsTab, PaymentsTabHeader } from "./PaymentsTab";
import "style/LN.less";

const LNPageHeader = () =>
  <TitleHeader
    iconClassName="ln"
    title={<T id="ln.title" m="Lightning Network" />}
  />;

const LNActivePage = () =>
  <TabbedPage header={<LNPageHeader />}>
    <Switch><Redirect from="/ln" exact to="/ln/wallet" /></Switch>
    <Tab path="/ln/wallet" component={WalletTab} header={WalletTabHeader} link={<T id="ln.tab.wallet" m="Wallet"/>}/>
    <Tab path="/ln/channels" component={ChannelsTab} header={ChannelsTabHeader} link={<T id="ln.tab.channels" m="Channels"/>}/>
    <Tab path="/ln/invoices" component={InvoicesTab} header={InvoicesTabHeader} link={<T id="ln.tab.invoices" m="Invoices"/>}/>
    <Tab path="/ln/payments" component={PaymentsTab} header={PaymentsTabHeader} link={<T id="ln.tab.payments" m="Payments"/>}/>
  </TabbedPage>;

const LNPage = ({ lnActive }) =>
  lnActive ? <LNActivePage /> : <LNConnectPage />;

export default lnPage(LNPage);
