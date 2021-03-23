import { FormattedMessage as T } from "react-intl";
import { TextInput } from "inputs";
import { useState } from "react";
import styles from "./QueryNode.module.css";

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

export default QueryNode;
