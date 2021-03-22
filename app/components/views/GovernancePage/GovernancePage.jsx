import { TabbedPage, TabbedPageTab as Tab, TitleHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { Switch, Redirect } from "react-router-dom";
import ProposalsTab from "./Proposals/ProposalsTab";
import VotingPrefsTab from "./Blockchain/Blockchain";
import TabHeader from "./TabHeader/TabHeader";
import { GOVERNANCE_ICON } from "constants";
import styles from "./GovernancePage.module.css";

const PageHeader = () => (
  <TitleHeader
    iconType={GOVERNANCE_ICON}
    title={<T id="governance.title" m="Governance" />}
  />
);

export default () => (
  <TabbedPage
    className={styles.governance}
    header={<PageHeader />}
    tabContentClassName={styles.tabContent}>
    <Switch>
      <Redirect from="/governance" exact to="/governance/proposals" />
      <Redirect
        from="/governance/proposals"
        exact
        to="/governance/proposals/prevote"
      />
    </Switch>

    <Tab
      path="/governance/proposals"
      component={ProposalsTab}
      header={TabHeader}
      link={<T id="governance.tab.proposals" m="Proposals" />}
    />
    <Tab
      path="/governance/blockchain"
      component={VotingPrefsTab}
      header={TabHeader}
      link={<T id="governance.tab.consensusChanges" m="Consensus Changes" />}
    />
  </TabbedPage>
);
