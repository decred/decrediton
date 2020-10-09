import Row from "./Row";
import { Balance } from "shared";
import { FormattedMessage as T } from "react-intl";
import {
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERRED
} from "constants";
import styles from "./TxHistory.module.css";
import { classNames, Text } from "pi-ui";

const TxDirection = ({ account, isCred, flat }) => (
  <span className={"is-row"}>
    {isCred ? (
      <T
        id="txHistory.out.tx"
        m="To {acc}"
        values={{
          acc: !flat ? (
            <div className={styles.status}>
              <div className={styles.accountName}>{account}</div>
            </div>
          ) : (
            account
          )
        }}
      />
    ) : (
      <T
        id="txHistory.in.tx"
        m="From {acc}"
        values={{
          acc: !flat ? (
            <div className={styles.status}>
              <div className={styles.accountName}>{account}</div>
            </div>
          ) : (
            account
          )
        }}
      />
    )}
  </span>
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
      {!overview &&
        (txDirection === TRANSACTION_DIR_TRANSFERRED ? (
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
        ))}
      {!pending && (
        <div className={styles.timeDateSpacer}>{timeMessage(txTs)}</div>
      )}
    </div>
    {overview && (
      <div className={styles.amountHash}>
        <Text id={`fromto-${(txTs || new Date()).getTime()}`} truncate>
          {txDirection === TRANSACTION_DIR_TRANSFERRED ? (
            <>
              <TxDirection account={txAccountNameDebited} flat />
              <TxDirection account={txAccountNameDebited} flat isCred />
            </>
          ) : txDirection !== TRANSACTION_DIR_RECEIVED ? (
            <T
              id="txHistory.overview.tx"
              m="From {debAcc} To {credAcc}"
              values={{
                debAcc: txAccountName,
                credAcc: txOutputAddresses
              }}
            />
          ) : (
            <T
              id="txHistory.overview.in.tx"
              m="To {credAcc}"
              values={{ credAcc: txAccountName }}
            />
          )}
        </Text>
      </div>
    )}
  </Row>
);

export default RegularTxRow;
