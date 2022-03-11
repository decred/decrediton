import { TabbedPage, TitleHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import ProposalsTab from "./Proposals";
import VotingPrefsTab from "./Blockchain";
import TabHeader from "./TabHeader";
import TreasurySpendingTab from "./TreasurySpendingTab";
import { GOVERNANCE_ICON } from "constants";
import styles from "./GovernancePage.module.css";
import { useTheme, DEFAULT_DARK_THEME_NAME } from "pi-ui";

const PageHeader = () => (
  <TitleHeader
    iconType={GOVERNANCE_ICON}
    title={<T id="governance.title" m="Governance" />}
  />
);

export default () => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  const tabs = [
    {
      path: "/governance/proposals",
      content: <ProposalsTab isDarkTheme={isDarkTheme} />,
      header: TabHeader,
      label: <T id="governance.tab.proposals" m="Proposals" />
    },
    {
      path: "/governance/blockchain",
      content: VotingPrefsTab,
      header: TabHeader,
      label: <T id="governance.tab.consensusChanges" m="Consensus Changes" />
    },
    {
      path: "/governance/treasury",
      content: TreasurySpendingTab,
      header: TabHeader,
      label: <T id="governance.tab.treasurySpending" m="Treasury Spending" />
    }
  ];
  return (
    <TabbedPage
      header={<PageHeader />}
      tabs={tabs}
      tabContentClassName={styles.tabContent}
    />
  );
};
