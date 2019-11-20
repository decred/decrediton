import { RegularTxRowOfClass as regular } from "./RegularTxRow";
import { StakeTxRowOfType as stake } from "./StakeTxRow";
import { defineMessages, injectIntl } from "react-intl";
import * as txTypes from "constants/Decrediton";
import "style/TxHistory.less";

const TxRowByType = {
  [txTypes.TICKET]: stake,
  [txTypes.VOTE] : stake,
  [txTypes.REVOCATION] : stake,
  [txTypes.UNKNOWN] : stake,
  [txTypes.VOTED] : stake,
  [txTypes.UNMINED] : stake,
  [txTypes.IMMATURE] : stake,
  [txTypes.MISSED] : stake,
  [txTypes.EXPIRED] : stake,
  [txTypes.REVOKED] : stake,
  [txTypes.LIVE] : stake,
  [txTypes.OUT] : regular,
  [txTypes.IN] : regular,
  [txTypes.TRANSFER] : regular,
  [txTypes.COINBASE] : regular
};

export const timeMessageDefine = defineMessages({
  dayMonthHourDisplay: {
    id: "txHistory.dayMonthHourDisplay",
    defaultMessage: "{value, date, short-month-24hour}"
  }
});

export const timeMessage = (txTimestamp, intl) => intl.formatMessage(timeMessageDefine.dayMonthHourDisplay, { value: txTimestamp });

const TxRow = ({ tx, overview, tsDate, intl }, { router }) => {
  let rowType = tx.status ? tx.status :
    tx.txType ? tx.txType : tx.txDirection;

  rowType = rowType.toLowerCase();
  // calls the component we defined above at TxRowByType.
  const Component = TxRowByType[rowType](rowType);

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
  router: PropTypes.object.isRequired
};

export default injectIntl(TxRow);
