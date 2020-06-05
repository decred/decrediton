import Row from "./Row";
import { messageByType } from "./helpers";
import { classNames } from "pi-ui";
import styles from "./TxHistory.module.css";

const EligibleRow = ({ className, ...props }) => {
  const status = className;
  const typeMsg = messageByType[status] || "(unknown type)";

  return (
    <Row {...{ className, ...props }}>
      <div className={styles.eligibleRow}>
        <div>
          <span className={classNames(styles[className], styles.icon)} />
          <span className={styles.stakeType}>{typeMsg}</span>
        </div>
      </div>
    </Row>
  );
};

export default EligibleRow;
