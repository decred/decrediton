import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import styles from "./NetworkTab.module.css";

const DisabledBool = ({ disabled }) => {
  return disabled
    ? <T id="ln.nodeInfo.channel.disabled.true" m="true" />
    : <T id="ln.nodeInfo.channel.disabled.false" m="false" />;
};

const UpdateDate = ({ tsDate, timestamp }) => (
    <T
      id="ln.nodeInfo.updateDate"
      m={"{lastUpdate, date, medium} {lastUpdate, time, medium}"}
      values={{ lastUpdate: tsDate(timestamp) }}
    />
);


const Channel = ({ tsDate, nodeID, channel }) => {

  // On the following variables, n == the searched node, cp == counterparty.
  let cpNodePub = channel.node2Pub;
  let cpPolicy = channel.node2Policy;
  let nPolicy = channel.node1Policy;
  if (channel.node2Pub == nodeID) {
    cpNodePub = channel.node1Pub;
    cpPolicy = channel.node1Policy;
    nPolicy = channel.node2Policy;
  }

  return (<div className={styles.channel}>
    <span><T id="ln.nodeInfo.channel.capacity" m="Capacity" /></span>
    <span><Balance amount={channel.capacity} /></span>
    <span><T id="ln.nodeInfo.channel.lastUpdate" m="Last Update" /></span>
    <span><UpdateDate tsDate={tsDate} timestamp={channel.lastUpdate} /></span>
    <span><T id="ln.nodeInfo.channel.chanPoint" m="Channel Point" /></span>
    <span>{channel.chanPoint}</span>
    <span><T id="ln.nodeInfo.channel.otherNode" m="Counterparty" /></span>
    <span>{cpNodePub}</span>
    <div className={styles.policyGrid}>
      <span className={styles.policyLabel}><T id="ln.nodeInfo.channel.policy.name" m="Policy" /></span>
      <span className={styles.policyLabel}><T id="ln.nodeInfo.channel.policy.node" m="Node" /></span>
      <span className={styles.policyLabel}><T id="ln.nodeInfo.channel.policy.counterparty" m="Counterparty" /></span>
      <span className={styles.policyLabel}><T id="ln.nodeInfo.channel.policy.disabled" m="Chan Disabled" /></span>
      <span><DisabledBool disabled={nPolicy.disabled}/></span>
      <span><DisabledBool disabled={cpPolicy.disabled}/></span>
      <span className={styles.policyLabel}><T id="ln.nodeInfo.channel.policy.timelock" m="Timelock Delta" /></span>
      <span>{nPolicy.timeLockDelta}</span>
      <span>{cpPolicy.timeLockDelta}</span>
      <span className={styles.policyLabel}><T id="ln.nodeInfo.channel.policy.minHtlc" m="Min HTLC" /></span>
      <span><Balance amount={nPolicy.minHtlc} /></span>
      <span><Balance amount={cpPolicy.minHtlc} /></span>
      <span className={styles.policyLabel}><T id="ln.nodeInfo.channel.policy.maxHtlc" m="Max HTLC" /></span>
      <span><Balance amount={nPolicy.maxHtlcMAtoms / 1000} /></span>
      <span><Balance amount={cpPolicy.maxHtlcMAtoms / 1000} /></span>
      <span className={styles.policyLabel}><T id="ln.nodeInfo.channel.policy.lastUpdate" m="Last Update" /></span>
      <span><UpdateDate tsDate={tsDate} timestamp={nPolicy.lastUpdate} /></span>
      <span><UpdateDate tsDate={tsDate} timestamp={cpPolicy.lastUpdate} /></span>
    </div>
  </div>);
};

const NodeInfo = ({ nodeInfo, tsDate }) => (
  <div className={styles.nodeInfo}>
    <div className={styles.basicInfo}>
      <span><T id="ln.nodeInfo.pubkey" m="PubKey" /></span>
      <span>{nodeInfo.node.pubKey}</span>
      <span><T id="ln.nodeInfo.alias" m="Alias" /></span>
      <span>{nodeInfo.node.alias || ""}</span>
      <span><T id="ln.nodeInfo.totalCapacity" m="Total Capacity" /></span>
      <span><Balance amount={nodeInfo.totalCapacity} /></span>
      <span><T id="ln.nodeInfo.lastUpdate" m="Last Update" /></span>
      <span><T
        id="ln.nodeInfo.lastUpdateDate"
        m={"{lastUpdate, date, medium} {lastUpdate, time, medium}"}
        values={{ lastUpdate: tsDate(nodeInfo.node.lastUpdate) }}
        />
      </span>
    </div>

    <h2><T id="ln.nodeInfo.channelsList" m="Channels"/></h2>
    <div className={styles.channelList}>
      { nodeInfo.channelsList.map( c =>
        <Channel
          key={c.channelId}
          tsDate={tsDate}
          nodeID={nodeInfo.node.pubKey}
          channel={c}
        />) }
    </div>
  </div>
);

export default NodeInfo;
