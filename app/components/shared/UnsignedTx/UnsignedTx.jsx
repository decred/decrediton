import { CopyToClipboardButton } from "buttons";
import styles from "./UnsignedTx.module.css";

const UnsignedTx = ({ tx, title }) => (
  <div className={styles.txArea}>
    <div className={styles.txTitle}>{title}</div>
    <div className={styles.tx}>{tx}</div>
    <CopyToClipboardButton textToCopy={tx} className={styles.copyIcon} />
  </div>
);

export default UnsignedTx;
