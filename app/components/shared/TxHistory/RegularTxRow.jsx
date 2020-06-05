import Row from "./Row";
import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import {
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERRED
} from "constants";
import styles from "./TxHistory.module.css";
import { classNames } from "pi-ui";

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
    <div className="is-row">
      <span className={classNames(styles[className], styles.icon)} />
      <span className={styles.amountValue}>
        <Balance
          amount={
            txDirection !== TRANSACTION_DIR_RECEIVED ? -txAmount : txAmount
          }
        />
      </span>
      {!overview &&
        (txDirection === TRANSACTION_DIR_TRANSFERRED ? (
          <div className={classNames("is-row", styles.info)}>
            <T
              id="txHistory.transfer.tx"
              m="From {debAcc} To {credAcc}"
              values={{
                debAcc: (
                  <div className={styles.status}>
                    <div className={styles.accountName}>
                      {txAccountNameDebited}
                    </div>
                  </div>
                ),
                credAcc: (
                  <div className={styles.status}>
                    <div className={styles.accountName}>
                      {txAccountNameCredited}
                    </div>
                  </div>
                )
              }}
            />
          </div>
        ) : txDirection !== TRANSACTION_DIR_RECEIVED ? (
          <div className={classNames("is-row", styles.info)}>
            <T
              id="txHistory.out.tx"
              m="From {debAcc} To {credAcc}"
              values={{
                debAcc: (
                  <div className={styles.status}>
                    <div className={styles.accountName}>{txAccountName}</div>
                  </div>
                ),
                credAcc: (
                  <div className={styles.status}>
                    <div className={styles.accountName}>
                      {txOutputAddresses}
                    </div>
                  </div>
                )
              }}
            />
          </div>
        ) : (
          <div className={classNames("is-row", styles.info)}>
            <T
              id="txHistory.in.tx"
              m="To {credAcc}"
              values={{
                credAcc: (
                  <div className={styles.status}>
                    <div className={styles.accountName}>{txAccountName}</div>
                  </div>
                )
              }}
            />
          </div>
        ))}
      {!pending && (
        <div className={styles.timeDateSpacer}>{timeMessage(txTs)}</div>
      )}
    </div>
    {overview && (
      <div className={styles.amountHash}>
        {txDirection === TRANSACTION_DIR_TRANSFERRED ? (
          <T
            id="txHistory.transfer.tx"
            m="From {debAcc} To {credAcc}"
            values={{
              debAcc: txAccountNameDebited,
              credAcc: txAccountNameCredited
            }}
          />
        ) : txDirection !== TRANSACTION_DIR_RECEIVED ? (
          <T
            id="txHistory.out.tx"
            m="From {debAcc} To {credAcc}"
            values={{
              debAcc: txAccountName,
              credAcc: txOutputAddresses
            }}
          />
        ) : (
          <T
            id="txHistory.in.tx"
            m="To {credAcc}"
            values={{ credAcc: txAccountName }}
          />
        )}
      </div>
    )}
  </Row>
);

export default RegularTxRow;
