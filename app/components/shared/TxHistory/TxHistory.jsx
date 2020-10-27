import RegularTxRow from "./RegularTxRow";
import StakeTxRow from "./StakeTxRow";
import EligibleRow from "./EligibleRow";
import LiveStakeTxRow from "./LiveStakeTxRow";
import * as txTypes from "constants/Decrediton";
import { defineMessages, injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";

const TxRowByType = {
  // LiveStakeTxRow is used for tickets which can still be voted.
  [txTypes.UNMINED]: LiveStakeTxRow,
  [txTypes.IMMATURE]: LiveStakeTxRow,
  [txTypes.LIVE]: LiveStakeTxRow,
  // Otherwise we use stakeTxRow
  [txTypes.TICKET]: StakeTxRow,
  [txTypes.VOTE]: StakeTxRow,
  [txTypes.REVOCATION]: StakeTxRow,
  [txTypes.UNKNOWN]: StakeTxRow,
  [txTypes.VOTED]: StakeTxRow,
  [txTypes.MISSED]: StakeTxRow,
  [txTypes.EXPIRED]: StakeTxRow,
  [txTypes.REVOKED]: StakeTxRow,
  [txTypes.TRANSACTION_DIR_SENT]: RegularTxRow,
  [txTypes.TRANSACTION_DIR_RECEIVED]: RegularTxRow,
  [txTypes.TRANSFER]: RegularTxRow,
  [txTypes.COINBASE]: RegularTxRow,
  [txTypes.ELIGIBLE]: EligibleRow
};

const timeMessageDefine = defineMessages({
  dayMonthHourDisplay: {
    id: "txHistory.dayMonthHourDisplay",
    defaultMessage: "{value, date, short-month-24hour}"
  },
  dayMonthDisplay: {
    id: "txHistory.dayMonthDisplay",
    defaultMessage: "{value, date}"
  }
});

// TxHistory is responsible for calling the right component row according to
// the Tx row type.
const TxHistory = ({
  transactions = [],
  limit,
  overview,
  mode,
  tsDate,
  intl,
  history
}) => {
  const isEligibleTicket = mode === "eligible";
  return (
    <>
      {transactions.map((tx, index) => {
        if (limit && index >= limit) return;
        if (!tx) return;
        const txTimestamp = tx && tx.enterTimestamp
          ? tx.enterTimestamp
          : tx.timestamp;
        // we define the transaction icon by its rowType, so we pass it as a
        // className props
        let rowType = tx.status || tx.txType;
        rowType = rowType.toLowerCase();
        // If it is a regular tx we use its direction to show a proper icon.
        if (rowType === txTypes.REGULAR) rowType = tx.txDirection;

        // gets the proper component to show, based on it rowType
        const Component =
          TxRowByType[isEligibleTicket ? txTypes.ELIGIBLE : rowType];
        const key = tx.spenderHash ? tx.spenderHash : tx.txHash;

        const txOutputAddresses =
          tx.outputs &&
          tx.outputs
            .filter((o) => !o.isChange)
            .map((o) => o.address)
            .join(" ");
        return (
          <Component
            key={key}
            {...{
              ...tx,
              txOutputAddresses,
              className: rowType,
              intl,
              txTs: txTimestamp && tsDate(txTimestamp),
              overview,
              pending: tx.isPending,
              onClick: () => history.push(`/transaction/history/${tx.txHash}`),
              timeMessage: (txTimestamp) =>
                intl.formatMessage(
                  isEligibleTicket
                    ? timeMessageDefine.dayMonthDisplay
                    : timeMessageDefine.dayMonthHourDisplay,
                  {
                    value: txTimestamp
                  }
                )
            }}
          />
        );
      })}
    </>
  );
};

export default withRouter(injectIntl(TxHistory));
