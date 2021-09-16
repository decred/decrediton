import { FormattedMessage as T } from "react-intl";
import { Subtitle, Balance } from "shared";
import Channel from "./Channel";
import styles from "./NodeInfo.module.css";

const NodeInfo = ({ nodeInfo, tsDate, chanpointURL }) => (
  <div className={styles.nodeInfo}>
    <div className={styles.basicInfo}>
      <span>
        <T id="ln.nodeInfo.pubkey" m="PubKey" />
      </span>
      <div className={styles.basicInfoContent}>{nodeInfo.node.pubKey}</div>
      <span>
        <T id="ln.nodeInfo.alias" m="Alias" />
      </span>
      <div className={styles.basicInfoContent}>{nodeInfo.node.alias || ""}</div>
      <span>
        <T id="ln.nodeInfo.totalCapacity" m="Total Capacity" />
      </span>
      <div className={styles.basicInfoContent}>
        <Balance amount={nodeInfo.totalCapacity} />
      </div>
      <span>
        <T id="ln.nodeInfo.lastUpdate" m="Last Update" />
      </span>
      <div className={styles.basicInfoContent}>
        <T
          id="ln.nodeInfo.lastUpdateDate"
          m={"{lastUpdate, date, medium} {lastUpdate, time, medium}"}
          values={{ lastUpdate: tsDate(nodeInfo.node.lastUpdate) }}
        />
      </div>
    </div>

    <Subtitle title={<T id="ln.nodeInfo.channelsList" m="Channels" />} />
    <div className={styles.channelList}>
      {nodeInfo.channelsList.map((c) => (
        <Channel
          key={c.channelId}
          tsDate={tsDate}
          nodeID={nodeInfo.node.pubKey}
          channel={c}
          chanpointURL={chanpointURL}
        />
      ))}
    </div>
  </div>
);

export default NodeInfo;
