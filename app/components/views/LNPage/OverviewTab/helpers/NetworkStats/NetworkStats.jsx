import { FormattedMessage as T } from "react-intl";
import styles from "./NetworkStats.module.css";
import { Balance } from "shared";
import { classNames } from "pi-ui";

const GridItem = ({ className, label, value }) => (
  <div className={classNames(styles.item, className)}>
    <div className={styles.label}>{label}:</div>
    <div className={styles.value}>{value}</div>
  </div>
);

const NetworkStats = ({ network }) => (
  <div className={styles.grid}>
    <GridItem
      className={styles.nodes}
      label={<T id="ln.overviewTab.networkStats.nodes" m="Nodes" />}
      value={network.numNodes}
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
