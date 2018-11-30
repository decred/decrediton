import { TabbedPage, TabbedPageTab as Tab, TitleHeader, DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { Switch, Redirect } from "react-router-dom";
import { default as ProposalsTab } from "./Proposals";
import { default as BlockchainTab } from "./Blockchain";
import { Balance } from "shared";
import { treasuryInfo } from "connectors";
import "style/Governance.less";

const PageHeader = () =>
  <TitleHeader
    iconClassName="governance"
    title={<T id="governance.title" m="Governance" />}
  />;

const TabHeader = treasuryInfo(({ treasuryBalance }) =>
  <Aux>
    <DescriptionHeader
      description={<T id="governance.description" m="Governance aspects of Decred." />}
    />
    { treasuryBalance && <DescriptionHeader
      description={
        <T id="governance.treasury_balance" m="Available Treasury Balance: {treasuryBalance}"
          values={{ treasuryBalance: <Balance flat amount={treasuryBalance} classNameWrapper="header-small-balance"/> }} />
      }
    />}
  </Aux>
);

export default () => (
  <TabbedPage className="governance" header={<PageHeader />} >
    <Switch>
      <Redirect from="/governance" exact to="/governance/proposals" />
      <Redirect from="/governance/proposals" exact to="/governance/proposals/prevote" />
    </Switch>

    <Tab path="/governance/proposals" component={ProposalsTab} header={TabHeader} link={<T id="governance.tab.proposals" m="Proposals"/>}/>
    <Tab path="/governance/blockchain" component={BlockchainTab} header={TabHeader} link={<T id="governance.tab.consensusChanges" m="Consensus Changes"/>}/>
  </TabbedPage>
);
