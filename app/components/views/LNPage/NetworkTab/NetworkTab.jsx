import { useNetworkTab } from "./hooks";
import { useState } from "react";
import { SimpleLoading } from "indicators";
import NodeInfo from "./NodeInfo/NodeInfo";
import RoutesInfo from "./RoutesInfo/RoutesInfo";
import NodeInfoError from "./NodeInfoError/NodeInfoError";
import NetworkInfo from "./NetworkInfo/NetworkInfo";
import QueryNode from "./QueryNode/QueryNode";
import QueryRoutes from "./QueryRoutes/QueryRoutes";
import Tabs from "./Tabs/Tabs";
import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";

export const NetworkTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="ln.description.network"
        m="General information about the current state of Decred's LN."
      />
    }
  />
);

const NetworkTab = () => {
  const {
    network,
    nodeInfo,
    routesInfo,
    tsDate,
    getNodeInfo,
    getNodeInfoAttempt,
    getRoutesInfoAttempt,
    getRoutesInfo,
    chanpointURL
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
        <NodeInfo nodeInfo={nodeInfo} tsDate={tsDate} chanpointURL={chanpointURL} />
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
