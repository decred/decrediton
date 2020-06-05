import Row from "./Row";
import { messageByType } from "./helpers";
import { classNames, Text } from "pi-ui";
import styles from "./TxHistory.module.css";
import { Balance } from "shared";

const EligibleRow = ({
  className,
  price,
  accountName,
  timeMessage,
  txTs,
  txHash,
  ...props
}) => {
  const status = className;
  const typeMsg = messageByType[status] || "(unknown type)";

  return (
    <Row {...{ className, ...props }}>
      <div className={styles.eligibleRow}>
        <div>
          <span className={classNames(styles[className], styles.icon)} />
          <span className={styles.stakeType}>{typeMsg}</span>
        </div>
        <div>Text</div>
        <Balance
          bold
          classNameAmount={styles.myTicketsPrice}
          classNameUnit={styles.noBold}
          amount={price}
        />
        <div>
          <Text id={`truncated-${txHash}`} truncate>
            {txHash}
          </Text>
        </div>
        <div className={styles.accountName}>{accountName}</div>
        <div>{timeMessage(txTs)}</div>
      </div>
    </Row>
  );
};

export default EligibleRow;
