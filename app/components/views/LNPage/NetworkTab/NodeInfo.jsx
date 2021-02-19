import { useNetworkTab } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import { Subtitle, Balance, ExternalLink } from "shared";
import { CopyableText } from "pi-ui";
import styles from "./NetworkTab.module.css";

const DisabledBool = ({ disabled }) => {
  return disabled ? (
    <T id="ln.nodeInfo.channel.disabled.true" m="true" />
  ) : (
    <T id="ln.nodeInfo.channel.disabled.false" m="false" />
  );
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

  const { chanpointURL } = useNetworkTab();
  return (
    <div className={styles.channel}>
      <div className={styles.channelInfo}>
        <div>
          <span>
            <T id="ln.nodeInfo.channel.capacity" m="Capacity" />
          </span>
          <div className={styles.infoContent}>
            <Balance amount={channel.capacity} />
          </div>
        </div>
        <div>
          <span>
            <T id="ln.nodeInfo.channel.chanPoint" m="Channel Point" />
          </span>
          <div className={styles.infoContent}>
            <ExternalLink href={chanpointURL(channel.chanPoint)}>
              {channel.chanPoint}
            </ExternalLink>
          </div>
        </div>
        <div>
          <span>
            <T id="ln.nodeInfo.channel.lastUpdate" m="Last Update" />
          </span>
          <div className={styles.infoContent}>
            <UpdateDate tsDate={tsDate} timestamp={channel.lastUpdate} />
          </div>
        </div>

        <div>
          <span>
            <T id="ln.nodeInfo.channel.otherNode" m="Counterparty" />
          </span>
          <CopyableText id="copyable" className={styles.copyableNode}>
            {cpNodePub}
          </CopyableText>
        </div>
      </div>
      <div className={styles.policyGrid}>
        <span className={styles.policyLabel}>
          <T id="ln.nodeInfo.channel.policy.name" m="Policy" />
        </span>
        <span className={styles.policyLabel}>
          <T id="ln.nodeInfo.channel.policy.node" m="Node" />
        </span>
        <span className={styles.policyLabel}>
          <T id="ln.nodeInfo.channel.policy.counterparty" m="Counterparty" />
        </span>
        <span className={styles.policyLabel}>
          <T id="ln.nodeInfo.channel.policy.disabled" m="Chan Disabled" />
        </span>
        <span>
          {nPolicy ? (
            <DisabledBool disabled={nPolicy.disabled} />
          ) : (
            <T id="ln.nodeInfo.channel.policy.noInfo" m="no info" />
          )}
        </span>
        <span>
          {cpPolicy ? (
            <DisabledBool disabled={cpPolicy.disabled} />
          ) : (
            <T id="ln.nodeInfo.channel.policy.noInfo" m="no info" />
          )}
        </span>
        <span className={styles.policyLabel}>
          <T id="ln.nodeInfo.channel.policy.timelock" m="Timelock Delta" />
        </span>
        <span>
          {nPolicy ? (
            nPolicy.timeLockDelta
          ) : (
            <T id="ln.nodeInfo.channel.policy.noInfo" m="no info" />
          )}
        </span>
        <span>
          {cpPolicy ? (
            cpPolicy.timeLockDelta
          ) : (
            <T id="ln.nodeInfo.channel.policy.noInfo" m="no info" />
          )}
        </span>
        <span className={styles.policyLabel}>
          <T id="ln.nodeInfo.channel.policy.minHtlc" m="Min HTLC" />
        </span>
        <span>
          {nPolicy ? (
            <Balance amount={nPolicy.minHtlc} />
          ) : (
            <T id="ln.nodeInfo.channel.policy.noInfo" m="no info" />
          )}
        </span>
        <span>
          {cpPolicy ? (
            <Balance amount={cpPolicy.minHtlc} />
          ) : (
            <T id="ln.nodeInfo.channel.policy.noInfo" m="no info" />
          )}
        </span>

        <span className={styles.policyLabel}>
          <T id="ln.nodeInfo.channel.policy.maxHtlc" m="Max HTLC" />
        </span>
        <span>
          {nPolicy ? (
            <Balance amount={nPolicy.maxHtlcMAtoms / 1000} />
          ) : (
            <T id="ln.nodeInfo.channel.policy.noInfo" m="no info" />
          )}
        </span>
        <span>
          {cpPolicy ? (
            <Balance amount={cpPolicy.maxHtlcMAtoms / 1000} />
          ) : (
            <T id="ln.nodeInfo.channel.policy.noInfo" m="no info" />
          )}
        </span>
        <span className={styles.policyLabel}>
          <T id="ln.nodeInfo.channel.policy.lastUpdate" m="Last Update" />
        </span>
        <span>
          {nPolicy ? (
            <UpdateDate tsDate={tsDate} timestamp={nPolicy.lastUpdate} />
          ) : (
            <T id="ln.nodeInfo.channel.policy.noInfo" m="no info" />
          )}
        </span>
        <span>
          {cpPolicy ? (
            <UpdateDate tsDate={tsDate} timestamp={cpPolicy.lastUpdate} />
          ) : (
            <T id="ln.nodeInfo.channel.policy.noInfo" m="no info" />
          )}
        </span>
      </div>
    </div>
  );
};

const NodeInfo = ({ nodeInfo, tsDate }) => (
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
        />
      ))}
    </div>
  </div>
);

export default NodeInfo;
