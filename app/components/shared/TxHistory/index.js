import { RegularTxRow } from "./RegularTxRow";
import { StakeTxRow } from "./StakeTxRow";
import * as txTypes from "constants/Decrediton";
import { defineMessages, injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";

const TxRowByType = {
  [txTypes.TICKET]: StakeTxRow,
  [txTypes.VOTE]: StakeTxRow,
  [txTypes.REVOCATION]: StakeTxRow,
  [txTypes.UNKNOWN]: StakeTxRow,
  [txTypes.VOTED]: StakeTxRow,
  [txTypes.UNMINED]: StakeTxRow,
  [txTypes.IMMATURE]: StakeTxRow,
  [txTypes.MISSED]: StakeTxRow,
  [txTypes.EXPIRED]: StakeTxRow,
  [txTypes.REVOKED]: StakeTxRow,
  [txTypes.LIVE]: StakeTxRow,
  [txTypes.OUT]: RegularTxRow,
  [txTypes.IN]: RegularTxRow,
  [txTypes.TRANSFER]: RegularTxRow,
  [txTypes.COINBASE]: RegularTxRow
};

const timeMessageDefine = defineMessages({
  dayMonthHourDisplay: {
    id: "txHistory.dayMonthHourDisplay",
    defaultMessage: "{value, date, short-month-24hour}"
  }
});

// TxHistory is responsible for calling the right component row according to
// the Tx row type.
const TxHistory = ({
  transactions = [],
  limit,
  overview,
  isRegular,
  isStake,
  tsDate,
  intl,
  history
}) => (
  <>
    {transactions.map((tx, index) => {
      if (limit && index >= limit) return;

      const txTimestamp = tx.txTimestamp;
      // we define the transaction icon by its rowType, so we pass it as a
      // className props
      let rowType = tx.status || tx.txType || tx.txDirection;
      rowType = rowType.toLowerCase();
      const Component = TxRowByType[rowType];
      if (Component === StakeTxRow && isRegular) return;
      if (Component === RegularTxRow && isStake) return;

      const txOutputAddresses =
        tx.originalTx &&
        tx.originalTx.outputs &&
        tx.originalTx.outputs
          .filter((o) => !o.isChange)
          .map((o) => o.address)
          .join(" ");
      return (
        <Component
          key={tx.txHash}
          {...{
            ...tx,
            txOutputAddresses,
            className: rowType,
            intl,
            txTs: txTimestamp && tsDate(txTimestamp),
            overview,
            pending: tx.isPending,
            onClick: () => history.push(`/transactions/history/${tx.txHash}`),
            timeMessage: (txTimestamp) =>
              intl.formatMessage(timeMessageDefine.dayMonthHourDisplay, {
                value: txTimestamp
              })
          }}
        />
      );
    })}
  </>
);

export default withRouter(injectIntl(TxHistory));
