import { Tooltip } from "shared";
import { useState } from "react";
import { FormattedMessage as T } from "react-intl";
import { TabsHeader } from "shared";
import styles from "./ProposalsFilter.module.css";

const tabs = [
  {
    label: (
      <Tooltip text={<T id="proposals.statusLinks.allFinishedVote" m="All" />}>
        <T id="proposals.statusLinks.allFinishedVote" m="All" />
      </Tooltip>
    ),
    value: "finishedVote",
    icon: styles.allIcon
  },
  {
    label: (
      <Tooltip
        text={<T id="proposals.statusLinks.approvedVote" m="Approved" />}>
        <T id="proposals.statusLinks.approvedVote" m="Approved" />
      </Tooltip>
    ),
    value: "approvedVote",
    icon: styles.approvedIcon
  },
  {
    label: (
      <Tooltip
        text={<T id="proposals.statusLinks.rejectedVote" m="Rejected" />}>
        <T id="proposals.statusLinks.rejectedVote" m="Rejected" />
      </Tooltip>
    ),
    value: "rejectedVote",
    icon: styles.rejectedIcon
  }
];

const ProposalsFilter = ({ setFilterTab }) => {
  const [filterTabIndex, setFilterTabIndex] = useState(0);

  const onSelectFilterTab = (index) => {
    const newTab = tabs[index].value;
    setFilterTabIndex(index);
    setFilterTab(newTab);
  };

  return (
    <div className={styles.tabs}>
      <TabsHeader
        tabs={tabs}
        setActiveTabIndex={onSelectFilterTab}
        activeTabIndex={filterTabIndex}
      />
    </div>
  );
};

export default ProposalsFilter;
