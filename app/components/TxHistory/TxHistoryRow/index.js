import { RegularTxRowOfClass as regular } from "./RegularTxRow";
import { StakeTxRowOfType as stake } from "./StakeTxRow";
import { defineMessages, injectIntl } from "react-intl";
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

export const timeMessageDefine = defineMessages({
  dayMonthHourDisplay: {
    id: "txHistory.dayMonthHourDisplay",
    defaultMessage: "{value, date, short-month-24hour}"
  },
});

export const timeMessage = (txTimestamp, intl) => intl.formatMessage(timeMessageDefine.dayMonthHourDisplay, { value: txTimestamp });

const TxRow = ({ tx, overview, tsDate, intl }, { router }) => {
  const rowType = tx.status ? tx.status :
    tx.txType ? tx.txType : tx.txDirection;
  const Component = TxRowByType[rowType];

  return Component ? (
    <Component
      {...{
        ...tx,
        intl,
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

export default injectIntl(TxRow);
