import { TabbedPage, TabbedPageTab as Tab, TitleHeader, DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { Switch, Redirect } from "react-router-dom";
import { default as ProposalsTab } from "./Proposals";
import "style/Governance.less";

const PageHeader = () =>
  <TitleHeader
    iconClassName="governance"
    title={<T id="governance.title" m="Governance" />}
  />;

const TabHeader = () =>
  <DescriptionHeader
    description={<T id="governance.description" m="Governance aspects of Decred." />}
  />;

export default () => (
  <TabbedPage header={<PageHeader />} >
    <Switch>
      <Redirect from="/governance" exact to="/governance/proposals" />
      <Redirect from="/governance/proposals" exact to="/governance/proposals/activevote" />
    </Switch>

    <Tab path="/governance/proposals" component={ProposalsTab} header={TabHeader} link={<T id="governance.tab.proposals" m="Proposals"/>}/>
  </TabbedPage>
);
