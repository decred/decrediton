import { memo, useCallback } from "react";
import RegularTxRow from "./RegularTxRow";
import StakeTxRow from "./StakeTxRow";
import LiveStakeTxRow from "./LiveStakeTxRow";
import * as txTypes from "constants/decrediton";
import { shortDatetimeFormatter } from "helpers";
import { isEqual } from "lodash/fp";

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
  [txTypes.TICKET_FEE]: RegularTxRow,
  [txTypes.SELFTRANSFER]: RegularTxRow,
  [txTypes.MIXED]: RegularTxRow,
  [txTypes.COINBASE]: RegularTxRow
};

const TxRow = ({ tx, tsDate, overview, history, activeRow, setActiveRow }) => {
  const txHash = tx.txHash;
  const txTimestamp = tx.enterTimestamp || tx.timestamp; // we define the transaction icon by its rowType, so we pass it as a
  // className props
  let rowType = tx.status || tx.txType;
  rowType = rowType.toLowerCase();
  // If it is a regular tx we use its direction to show a proper icon.
  if (rowType === txTypes.REGULAR) {
    rowType = tx.txDirection;
  } else {
    rowType = [
      txTypes.MISSED,
      txTypes.UNMINED,
      txTypes.IMMATURE,
      txTypes.LIVE
    ].includes(tx.status)
      ? tx.status
      : tx.txType;
  }
  if (tx.mixedTx) rowType = txTypes.MIXED;
  if (tx.selfTx) rowType = txTypes.SELFTRANSFER;

  // gets the proper component to show, based on it rowType
  const Component = TxRowByType[rowType];

  const txOutputAddresses =
    tx.outputs &&
    tx.outputs
      .filter((o) => !o.isChange)
      .map((o) => o.address)
      .join(" ");

  const onClick = useCallback(() => {
    setActiveRow(txHash);
    history.push(`/transactions/history/${txHash}`);
  }, [txHash, setActiveRow, history]);

  return (
    <Component
      {...{
        ...tx,
        active: activeRow === txHash,
        txOutputAddresses,
        className: rowType,
        txTs: txTimestamp && tsDate(txTimestamp),
        txLeaveTs: tx.leaveTimestamp && tsDate(tx.leaveTimestamp),
        overview,
        pending: tx.isPending,
        onClick,
        timeMessage: (txTimestamp) => shortDatetimeFormatter.format(txTimestamp)
      }}
    />
  );
};

export default memo(TxRow, (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
});
