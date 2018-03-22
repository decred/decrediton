import { TabbedPage, TabbedPageTab as Tab, TitleHeader, DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { Switch, Redirect } from "react-router-dom";
import { default as SignTab } from "./SignMessage";
import { default as ValidateAddressTab } from "./ValidateAddress";
import { default as VerifyMessageTab } from "./VerifyMessage";

const PageHeader = () =>
  <TitleHeader
    iconClassName="security"
    title={<T id="security.title" m="Security Center" />}
  />;

const TabHeader = () =>
  <DescriptionHeader
    description={<T id="security.description" m="Various tools that help in different aspects of crypto currency security will be located here." />}
  />;

export default () => (
  <TabbedPage header={<PageHeader />} >
    <Switch><Redirect from="/security" exact to="/security/sign" /></Switch>
    <Tab path="/security/sign" component={SignTab} header={TabHeader} link={<T id="security.tab.sign" m="Sign Message"/>}/>
    <Tab path="/security/verify" component={VerifyMessageTab} header={TabHeader} link={<T id="security.tab.verify" m="Verify Message"/>}/>
    <Tab path="/security/validate" component={ValidateAddressTab} header={TabHeader} link={<T id="security.tab.validate" m="Validate Address"/>}/>
  </TabbedPage>
);
