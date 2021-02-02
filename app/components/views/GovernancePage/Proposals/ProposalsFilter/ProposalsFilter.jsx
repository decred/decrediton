import { Tooltip } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { TabsHeader } from "shared";
import styles from "./ProposalsFilter.module.css";

const tabs = [
  {
    label: (
      <Tooltip
        content={<T id="proposals.statusLinks.allFinishedVote" m="All" />}>
        <T id="proposals.statusLinks.allFinishedVote" m="All" />
      </Tooltip>
    ),
    value: "finishedVote",
    icon: styles.allIcon
  },
  {
    label: (
      <Tooltip
        content={<T id="proposals.statusLinks.approvedVote" m="Approved" />}>
        <T id="proposals.statusLinks.approvedVote" m="Approved" />
      </Tooltip>
    ),
    value: "approvedVote",
    icon: styles.approvedIcon
  },
  {
    label: (
      <Tooltip
        content={<T id="proposals.statusLinks.rejectedVote" m="Rejected" />}>
        <T id="proposals.statusLinks.rejectedVote" m="Rejected" />
      </Tooltip>
    ),
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
