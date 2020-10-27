import { useNetworkTab } from "./hooks";
import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import { TextInput, DcrInput } from "inputs";
import { KeyBlueButton } from "buttons";
import { useState } from "react";
import { SimpleLoading } from "indicators";
import { classNames } from "pi-ui";
import NodeInfo from "./NodeInfo";
import RoutesInfo from "./RoutesInfo";
import styles from "./NetworkTab.module.css";

const NodeInfoError = ({ error }) => (
  <div className={styles.decodingError}>
    {("" + error).indexOf("unable to find node") > -1 ? (
      <T id="ln.networkTab.queryNode.errNotFound" m="Node not found" />
    ) : (
      "" + error
    )}
  </div>
);

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

const QueryNode = ({ getNodeInfo }) => {
  const [node, setNode] = useState("");

  const nodeChanged = (e) => {
    const newNode = e.target.value;
    setNode(newNode);
    if (newNode.length === 66) {
      getNodeInfo(newNode);
    }
  };

  return (
    <div className={styles.queryNode}>
      <T id="ln.networkTab.queryNodeId" m="Node ID" />
      <TextInput value={node} onChange={nodeChanged} />
    </div>
  );
};

const QueryRoutes = ({
  nodeID,
  amount,
  setNodeID,
  setAmount,
  getRoutes,
  setShowResult
}) => {
  const nodeChanged = (e) => {
    const newNode = e.target.value;
    if (newNode.length > 66) {
      return;
    }
    setNodeID(newNode);
    setShowResult(false);
  };

  const amtChanged = ({ atomValue }) => {
    setAmount(atomValue);
    setShowResult(false);
  };

  const requestRoutes = () => {
    getRoutes(nodeID, amount);
    setShowResult(true);
  };

  return (
    <div className={styles.queryRoutes}>
      <div className="memo">
        <T id="ln.networkTab.queryRoutes.nodeID" m="Node ID" />
        <TextInput value={nodeID} onChange={nodeChanged} />
      </div>
      <div className="value">
        <T id="ln.networkTab.queryRoutes.value" m="Value" />
        <DcrInput amount={amount} onChangeAmount={amtChanged} />
      </div>
      <KeyBlueButton
        className={styles.queryRoutesButton}
        onClick={requestRoutes}></KeyBlueButton>
    </div>
  );
};

const Tabs = ({ active, set }) => {
  const QUERY_NODE = 0;
  const QUERY_ROUTE = 1;
  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tabs}>
        <div
          className={classNames(
            styles.tabLeft,
            active === QUERY_NODE
              ? styles.tabBackgroundSelected
              : styles.tabBackgroundUnselected
          )}
          onClick={() => set(QUERY_NODE)}
        >
          <T id="ln.networkTab.tabQueryNode" m="Query Node" />
        </div>
        <div
          className={classNames(
            styles.tabRight,
            active === QUERY_ROUTE
              ? styles.tabBackgroundSelected
              : styles.tabBackgroundUnselected
          )}
          onClick={() => set(QUERY_ROUTE)}
        >
          <T id="ln.networkTab.tabQueryRoute" m="Query Route" />
        </div>
      </div>
    </div>
  );
};

const NetworkTab = () => {
  const {
    network,
    nodeInfo,
    routesInfo,
    tsDate,
    getNodeInfo,
    getNodeInfoAttempt,
    getRoutesInfoAttempt,
    getRoutesInfo
  } = useNetworkTab();
  const [activeTab, setActiveTab] = useState(0);
  const [nodeID, setNodeID] = useState("");
  const [amount, setAmount] = useState(1);
  const [showResult, setShowResult] = useState(false);
  return (
    <>
      {network ? <NetworkInfo network={network} /> : null}
      <Tabs active={activeTab} set={setActiveTab} />
      {activeTab === 0 ? (
        <QueryNode getNodeInfo={getNodeInfo} />
      ) : activeTab === 1 ? (
        <QueryRoutes
          getRoutes={getRoutesInfo}
          nodeID={nodeID}
          amount={amount}
          setNodeID={setNodeID}
          setAmount={setAmount}
          setShowResult={setShowResult}
        />
      ) : null}
      {nodeInfo instanceof Error ? (
        <NodeInfoError error={nodeInfo} />
      ) : getNodeInfoAttempt || getRoutesInfoAttempt ? (
        <SimpleLoading />
      ) : nodeInfo && activeTab === 0 ? (
        <NodeInfo nodeInfo={nodeInfo} tsDate={tsDate} />
      ) : showResult &&
        nodeID.length === 66 &&
        routesInfo &&
        activeTab === 1 ? (
        <RoutesInfo nodeID={nodeID} amount={amount} routes={routesInfo} />
      ) : null}
    </>
  );
};

export default NetworkTab;
