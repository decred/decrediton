import { useNetworkTab } from "./hooks";
import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import { TextInput } from "inputs";
import { useState } from "react";
import { SimpleLoading } from "indicators";
import NodeInfo from "./NodeInfo";
import styles from "./NetworkTab.module.css";

const NodeInfoError = ({ error }) => (
  <div>
    {(""+error).indexOf("unable to find node") > -1 ?
      <T id="ln.networkTab.queryNode.errNotFound" m="Node not found" /> :
      ("" + error)}
  </div>
);

const NetworkInfo = ({ network }) => (
  <div className={styles.networkInfo}>
    <div>
      <T id="ln.networkTab.numNodes" m="Nodes" />
    </div>
    <span>{network.numNodes}</span>

    <div>
      <T id="ln.networkTab.numChannels" m="Channels" />
    </div>
    <span>{network.numChannels}</span>

    <div>
      <T id="ln.networkTab.totalCapacity" m="Total Capacity" />
    </div>
    <span><Balance amount={network.totalNetworkCapacity}/></span>
  </div>
);

const QueryNode = ({ getNodeInfo }) => {
  const [node, setNode] = useState("");

  const nodeChanged = e => {
    const newNode = e.target.value;
    setNode(newNode);
    if (newNode.length === 66) {
      getNodeInfo(newNode);
    }
  };

  return (
    <div className={styles.queryNode}>
      <T id="ln.networkTab.queryNodeId" m="Node ID" />
      <TextInput
        value={node}
        onChange={nodeChanged}
      />
    </div>
  );
};

const NetworkTab = () => {
  const { network, nodeInfo, getNodeInfo, getNodeInfoAttempt, tsDate } = useNetworkTab();

  return (
    <>
      { network ? <NetworkInfo network={network} /> : null }
      <h2><T id="ln.networkTab.queryNode" m="Query Node Info"/></h2>
      <QueryNode getNodeInfo={getNodeInfo} />
      { nodeInfo instanceof Error ? <NodeInfoError error={nodeInfo} /> :
        getNodeInfoAttempt ? <SimpleLoading /> :
          nodeInfo ? <NodeInfo nodeInfo={nodeInfo} tsDate={tsDate} /> : null }
    </>
  );
};

export default NetworkTab;
