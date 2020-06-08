import { useCallback } from "react";
import Row from "./Row";
import { shell } from "electron";
import { messageByType } from "./helpers";
import { classNames, Link, RadioButton } from "pi-ui";
import styles from "./TxHistory.module.css";
import { Balance } from "shared";

const EligibleRow = ({
  className,
  ticketPrice,
  accountName,
  timeMessage,
  txTs,
  txUrl,
  txHash,
  voteChoice,
  ...props
}) => {
  const status = className;
  const typeMsg = messageByType[status] || "(unknown type)";
  const openTxUrl = useCallback(
    (e) => {
      shell.openExternal(txUrl);
      e.stopPropagation();
    },
    [txUrl]
  );
  return (
    <Row {...{ className, ...props, eligible: true }}>
      <div className={styles.eligible}>
        <div>
          <span className={classNames(styles[className], styles.icon)} />
          <span className={styles.stakeType}>{typeMsg}</span>
        </div>
        <div className={styles.voteChoice}>
          {voteChoice && (
            <RadioButton
              label={`${voteChoice.charAt(0).toUpperCase()}${voteChoice.slice(
                1
              )}`}
              checked={true}
              onChange={() => {}}
              className={styles[voteChoice]}
            />
          )}
        </div>
        <Balance
          bold
          classNameAmount={styles.myTicketsPrice}
          classNameUnit={styles.noBold}
          amount={ticketPrice}
        />
        <div>
          <Link
            href="#"
            onClick={openTxUrl}
            id={`truncated-${txHash}`}
            truncate>
            {txHash}
          </Link>
        </div>
        <div className={styles.accountName}>{accountName}</div>
        <div>{timeMessage(txTs)}</div>
      </div>
    </Row>
  );
};

export default EligibleRow;
