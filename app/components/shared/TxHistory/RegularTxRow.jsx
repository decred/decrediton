import Row from "./Row";
import { Balance, TruncatedText } from "shared";
import { FormattedMessage as T } from "react-intl";
import {
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_SENT,
  MIXED,
  SELFTRANSFER,
  TICKET_FEE
} from "constants";
import styles from "./TxHistory.module.css";
import { classNames, Tooltip } from "pi-ui";

const iconTooltipByType = (type) => {
  switch (type) {
    case MIXED:
      return <T id="txhistory.icon.mixed" m="Mix" />;
    case SELFTRANSFER:
      return <T id="txhistory.icon.self" m="Self transfer" />;
    case TRANSACTION_DIR_RECEIVED:
      return <T id="txhistory.icon.received" m="Received" />;
    case TRANSACTION_DIR_SENT:
      return <T id="txhistory.icon.sent" m="Sent" />;
    case TICKET_FEE:
      return <T id="txhistory.icon.ticketfee" m="Ticket fee" />;
    default:
      return <T id="txhistory.icon.transaction" m="Transaction" />;
  }
};

const TxDirection = ({ account, isCred, overview }) => (
  <div className={classNames(styles.direction, isCred && styles.isCred)}>
    {isCred ? (
      <T
        id="txHistory.out.tx"
        m="to {acc}"
        values={{
          acc: (
            <div className={styles.status}>
              <div className={styles.accountName}>
                <TruncatedText text={account} max={overview ? 10 : 20} />
              </div>
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
              <div className={styles.accountName}>
                <TruncatedText text={account} max={overview ? 10 : 20} />
              </div>
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
  active,
  ...props
}) => (
  <Row {...{ ...props, txAccountName, pending, overview, active }}>
    <div className={classNames(styles.info, overview && styles.overviewInfo)}>
      <div className={styles.iconContainer}>
        <Tooltip content={iconTooltipByType(className)} placement="right">
          <span className={classNames(styles[className], styles.icon)} />
        </Tooltip>
      </div>
      <span className={styles.amountValue}>
        <Balance
          amount={
            txDirection !== TRANSACTION_DIR_RECEIVED ? -txAmount : txAmount
          }
        />
      </span>
      {txDirection === TICKET_FEE ? (
        <div className={classNames("flex-row", styles.txDirection)}>
          <TxDirection account={txAccountNameDebited} overview={overview} />
          <TxDirection
            account={txAccountNameCredited}
            isCred
            overview={overview}
          />
        </div>
      ) : txDirection !== TRANSACTION_DIR_RECEIVED ? (
        <div className={classNames("flex-row", styles.txDirection)}>
          <TxDirection account={txAccountName} />
          <TxDirection account={txOutputAddresses} isCred overview={overview} />
        </div>
      ) : (
        <div className={classNames("flex-row", styles.txDirection)}>
          <TxDirection account={txAccountName} isCred overview={overview} />
        </div>
      )}
      {!pending && (
        <div className={styles.timeDateSpacer}>{timeMessage(txTs)}</div>
      )}
    </div>
  </Row>
);

export default RegularTxRow;
