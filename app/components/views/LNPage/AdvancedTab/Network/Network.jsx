import { useNetwork } from "./hooks";
import { useState } from "react";
import { SimpleLoading } from "indicators";
import NodeInfo from "./NodeInfo";
import RoutesInfo from "./RoutesInfo";
import NodeInfoError from "./NodeInfoError";
import QueryNode from "./QueryNode";
import QueryRoutes from "./QueryRoutes";
import Tabs from "./Tabs";

const Network = () => {
  const {
    nodeInfo,
    routesInfo,
    tsDate,
    getNodeInfo,
    getNodeInfoAttempt,
    getRoutesInfoAttempt,
    getRoutesInfo,
    chanpointURL
  } = useNetwork();

  const [activeTab, setActiveTab] = useState(0);
  const [nodeID, setNodeID] = useState("");
  const [amount, setAmount] = useState(1);
  const [showResult, setShowResult] = useState(false);

  return (
    <>
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
        <NodeInfo
          nodeInfo={nodeInfo}
          tsDate={tsDate}
          chanpointURL={chanpointURL}
        />
      ) : showResult &&
        nodeID.length === 66 &&
        routesInfo &&
        activeTab === 1 ? (
        <RoutesInfo nodeID={nodeID} amount={amount} routes={routesInfo} />
      ) : null}
    </>
  );
};

export default Network;
