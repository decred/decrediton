import { FormattedMessage as T } from "react-intl";
import styles from "./NetworkStats.module.css";
import { Balance } from "shared";
import { SearchForNodesButton } from "buttons";
import { classNames } from "pi-ui";

const GridItem = ({ className, label, value }) => (
  <div className={classNames(styles.item, className)}>
    <div className={styles.label}>{label}:</div>
    <div className={styles.value}>{value}</div>
  </div>
);

const Nodes = ({ numNodes, onNodeSelected, recentNodes }) => (
  <div className={styles.nodeWrapper}>
    <span>{numNodes}</span>
    <SearchForNodesButton
      className={styles.searchNodeButton}
      onSubmit={onNodeSelected}
      buttonLabel={<div className={styles.searchNodeButtonIcon} />}
      recentNodes={recentNodes}
    />
  </div>
);

const NetworkStats = ({ network, onNodeSelected, recentNodes }) => (
  <div className={styles.grid}>
    <GridItem
      className={styles.nodes}
      label={<T id="ln.overviewTab.networkStats.nodes" m="Nodes" />}
      value={
        <Nodes
          numNodes={network.numNodes}
          {...{ onNodeSelected, recentNodes }}
        />
      }
    />
    <GridItem
      className={styles.channels}
      label={<T id="ln.overviewTab.networkStats.channels" m="Channels" />}
      value={network.numChannels}
    />
    <GridItem
      className={styles.capacity}
      label={<T id="ln.overviewTab.networkStats.capacity" m="Capacity" />}
      value={
        <Balance
          flat
          amount={network.totalNetworkCapacity}
          classNameWrapper={styles.balance}
          classNameSecondary={styles.balanceSecondary}
          classNameUnit={styles.balanceUnit}
        />
      }
    />
  </div>
);

export default NetworkStats;
