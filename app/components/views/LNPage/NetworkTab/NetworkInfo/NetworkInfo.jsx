import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import styles from "./NetworkInfo.module.css";

const NetworkInfo = ({ network }) => (
  <div className={styles.networkInfo}>
    <div className={styles.networkTile}>
      <div className={styles.networkTileNumber}>{network.numNodes}</div>
      <T id="ln.networkTab.numNodes" m="Nodes" />
    </div>

    <div className={styles.networkTile}>
      <div className={styles.networkTileNumber}>{network.numChannels}</div>
      <T id="ln.networkTab.numChannels" m="Channels" />
    </div>

    <div className={styles.networkTile}>
      <div className={styles.networkTileNumber}>
        <Balance amount={network.totalNetworkCapacity} />
      </div>
      <T id="ln.networkTab.totalCapacity" m="Total Capacity" />
    </div>
  </div>
);

export default NetworkInfo;
