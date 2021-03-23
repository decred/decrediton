import { FormattedMessage as T } from "react-intl";
import { TextInput, DcrInput } from "inputs";
import { KeyBlueButton } from "buttons";
import styles from "./QueryRoutes.module.css";

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

export default QueryRoutes;
