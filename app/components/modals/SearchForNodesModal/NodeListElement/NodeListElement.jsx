import styles from "./NodeListElement.module.css";
import { Button } from "pi-ui";
import { TruncatedText } from "shared";

const NodeListElement = ({ alias, pubKey, onNodeSelected }) => (
  <li className={styles.listElement}>
    <div className={styles.square} />
    <div className={styles.content}>
      <div className={styles.alias}>{alias}</div>
      <div className={styles.pubKey}>
        <TruncatedText text={pubKey} max={8} />
      </div>
    </div>
    <Button
      aria-label="Select Node"
      kind="secondary"
      className={styles.selectButton}
      onClick={(e) => {
        e.preventDefault();
        onNodeSelected(pubKey);
      }}>
      <div className={styles.icon} />
    </Button>
  </li>
);

export default NodeListElement;
