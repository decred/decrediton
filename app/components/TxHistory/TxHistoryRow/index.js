import { RegularTxRowOfClass as regular } from "./RegularTxRow";
import { StakeTxRowOfType as stake } from "./StakeTxRow";
import "style/TxHistory.less";

const TxRowByType = { // TODO: use constants instead of string
  "Ticket": stake("Ticket"),
  "Vote": stake("Vote"),
  "Revocation": stake("Revocation"),
  "unknown": stake("Ticket"),
  "voted": stake("Voted"),
  "unmined": stake("Unmined"),
  "immature": stake("Immature"),
  "missed": stake("Missed"),
  "expired": stake("Expired"),
  "revoked": stake("Revoked"),
  "live": stake("Live"),
  "out": regular("Send", true),
  "in": regular("Receive", false),
  "transfer": regular("Transfer", true)
};

const TxRow = ({ tx, overview }, { router }) => {
  const rowType = tx.status ? tx.status :
    tx.txType ? tx.txType : tx.txDirection;
  const Component = TxRowByType[rowType];

  return Component ? (
    <Component
      {...{
        ...tx,
        overview,
        pending: !tx.txTimestamp,
        onClick: () => router.history.push(`/transactions/history/${tx.txHash}`)
      }}
    />
  ) : null;
};

TxRow.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default TxRow;
