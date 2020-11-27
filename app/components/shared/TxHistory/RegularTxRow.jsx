import Row from "./Row";
import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import {
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERRED
} from "constants";
import styles from "./TxHistory.module.css";
import { classNames } from "pi-ui";

const TxDirection = ({ account, isCred }) => (
  <div className={styles.direction}>
    {isCred ? (
      <T
        id="txHistory.out.tx"
        m="To {acc}"
        values={{
          acc: (
            <div className={styles.status}>
              <div className={styles.accountName}>{account}</div>
            </div>
          )
        }}
      />
    ) : (
      <T
        id="txHistory.in.tx"
        m="From {acc}"
        values={{
          acc: (
            <div className={styles.status}>
              <div className={styles.accountName}>{account}</div>
            </div>
          )
        }}
      />
    )}
  </div>
);

const RegularTxRow = ({
  txAmount,
  txDirection,
  overview,
  txAccountName,
  pending,
  txTs,
  txOutputAddresses,
  txAccountNameCredited,
  txAccountNameDebited,
  timeMessage,
  className,
  ...props
}) => (
  <Row {...{ ...props, txAccountName, pending, overview }}>
    <div className={classNames(styles.info, overview && styles.overviewInfo)}>
      <span className={classNames(styles[className], styles.icon)} />
      <span className={styles.amountValue}>
        <Balance
          amount={
            txDirection !== TRANSACTION_DIR_RECEIVED ? -txAmount : txAmount
          }
        />
      </span>
      {txDirection === TRANSACTION_DIR_TRANSFERRED ? (
        <div className={classNames("is-row", styles.txDirection)}>
          <TxDirection account={txAccountNameDebited} />
          <TxDirection account={txAccountNameCredited} isCred />
        </div>
      ) : txDirection !== TRANSACTION_DIR_RECEIVED ? (
        <div className={classNames("is-row", styles.txDirection)}>
          <TxDirection account={txAccountName} />
          <TxDirection account={txOutputAddresses} isCred />
        </div>
      ) : (
        <div className={classNames("is-row", styles.txDirection)}>
          <TxDirection account={txAccountName} isCred />
        </div>
      )}
      {!pending && (
        <div className={styles.timeDateSpacer}>{timeMessage(txTs)}</div>
      )}
    </div>
  </Row>
);

export default RegularTxRow;
