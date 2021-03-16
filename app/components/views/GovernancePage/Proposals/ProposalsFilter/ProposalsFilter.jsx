import { FormattedMessage as T } from "react-intl";
import { TabsHeader } from "shared";
import styles from "./ProposalsFilter.module.css";

const tabs = [
  {
    label: <T id="proposals.statusLinks.allFinishedVote" m="All" />,
    value: "finishedVote",
    icon: styles.allIcon
  },
  {
    label: <T id="proposals.statusLinks.approvedVote" m="Approved" />,
    value: "approvedVote",
    icon: styles.approvedIcon
  },
  {
    label: <T id="proposals.statusLinks.rejectedVote" m="Rejected" />,
    value: "rejectedVote",
    icon: styles.rejectedIcon
  }
];

const ProposalsFilter = ({ filterTab, setFilterTab }) => {
  const onSelectFilterTab = (index) => {
    const newTab = tabs[index].value;
    setFilterTab(newTab);
  };

  return (
    <div className={styles.tabs}>
      <TabsHeader
        tabs={tabs}
        setActiveTabIndex={onSelectFilterTab}
        activeTabIndex={tabs.findIndex((tab) => tab.value === filterTab)}
      />
    </div>
  );
};

export default ProposalsFilter;
