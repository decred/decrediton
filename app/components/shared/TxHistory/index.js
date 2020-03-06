import RegularTxRow from "./RegularTxRow"
import StakeTxRow from "./StakeTxRow"
import * as txTypes from "constants/Decrediton";

const TxRowByType = {
  [txTypes.TICKET]: StakeTxRow,
  [txTypes.VOTE] : StakeTxRow,
  [txTypes.REVOCATION] : StakeTxRow,
  [txTypes.UNKNOWN] : StakeTxRow,
  [txTypes.VOTED] : StakeTxRow,
  [txTypes.UNMINED] : StakeTxRow,
  [txTypes.IMMATURE] : StakeTxRow,
  [txTypes.MISSED] : StakeTxRow,
  [txTypes.EXPIRED] : StakeTxRow,
  [txTypes.REVOKED] : StakeTxRow,
  [txTypes.LIVE] : StakeTxRow,
  [txTypes.OUT] : RegularTxRow,
  [txTypes.IN] : RegularTxRow,
  [txTypes.TRANSFER] : RegularTxRow,
  [txTypes.COINBASE] : RegularTxRow
};

// TxHistory is responsible for calling the right component row according to
// the Tx row type.
const TxHistory = ({ transactions = [], limit, overview, isRegular, isStake, tsDate }) => (
  <>
    { transactions.map( (tx, index) => {
      if(limit && index >= limit) return;

      // we define the transaction icon by its rowType, so we pass it as a
      // className props
      let rowType = tx.status || tx.txType || tx.txDirection;
      rowType = rowType.toLowerCase();

      const Component = TxRowByType[rowType];
      if (Component === StakeTxRow && isRegular) return;
      if (Component === RegularTxRow && isStake) return;
      return (
        <Component key= {tx.txHash} {...{ overview, tx, tsDate, className: rowType }} />
      );
    })}
  </>
);

export default TxHistory;
