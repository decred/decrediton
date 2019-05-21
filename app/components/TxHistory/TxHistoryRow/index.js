import { RegularTxRowOfClass as regular } from "./RegularTxRow";
import { StakeTxRowOfType as stake } from "./StakeTxRow";
import { FormattedDate, FormattedTime, FormattedMessage as T } from "react-intl";
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
  "transfer": regular("Transfer", true),
  "Coinbase": regular("Receive", true),
};

export const timeMessage = (txTimestamp) => <T
  id="txHistory.statusSmall.date"
  defaultMessage="{day} {month} {year} {time}"
  values={{
    day: <FormattedDate value={txTimestamp} day="2-digit" />,
    month: <FormattedDate value={txTimestamp} month="short" />,
    year: <FormattedDate value={txTimestamp} year="numeric" />,
    time: <FormattedTime value={txTimestamp} hour12={false} />,
  }}
/>;

const TxRow = ({ tx, overview, tsDate }, { router }) => {
  const rowType = tx.status ? tx.status :
    tx.txType ? tx.txType : tx.txDirection;
  const Component = TxRowByType[rowType];

  return Component ? (
    <Component
      {...{
        ...tx,
        txTs: tsDate(tx.txTimestamp),
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
