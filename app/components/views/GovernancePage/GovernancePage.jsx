import { TabbedPage, TitleHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import ProposalsTab from "./Proposals";
import VotingPrefsTab from "./Blockchain";
import TabHeader from "./TabHeader";
import { GOVERNANCE_ICON } from "constants";
import styles from "./GovernancePage.module.css";

const PageHeader = () => (
  <TitleHeader
    iconType={GOVERNANCE_ICON}
    title={<T id="governance.title" m="Governance" />}
  />
);

const tabs = [
  {
    path: "/governance/proposals",
    content: ProposalsTab,
    header: TabHeader,
    label: <T id="governance.tab.proposals" m="Proposals" />
  },
  {
    path: "/governance/blockchain",
    content: VotingPrefsTab,
    header: TabHeader,
    label: <T id="governance.tab.consensusChanges" m="Consensus Changes" />
  }
];

export default () => (
  <TabbedPage
    header={<PageHeader />}
    tabs={tabs}
    tabContentClassName={styles.tabContent}
  />
);
