import { RegularTxRow } from "./RegularTxRow";
import { defineMessages, injectIntl } from "react-intl";
import "style/TxHistory.less";

const timeMessageDefine = defineMessages({
  dayMonthHourDisplay: {
    id: "txHistory.dayMonthHourDisplay",
    defaultMessage: "{value, date, short-month-24hour}"
  }
});

export const timeMessage = (txTimestamp, intl) => intl.formatMessage(timeMessageDefine.dayMonthHourDisplay, { value: txTimestamp });

const TxRow = ({ tx, overview, tsDate, intl }, { router }) => {
  // we define the transaction icon by its rowType, so we pass it as a
  // classname props.
  let rowType = tx.status || tx.txType || tx.txDirection;
  rowType = rowType.toLowerCase();

  return <RegularTxRow
      {...{
        ...tx,
        className: rowType,
        intl,
        txTs: tsDate(tx.txTimestamp),
        overview,
        pending: !tx.txTimestamp,
        onClick: () => router.history.push(`/transactions/history/${tx.txHash}`)
      }}
    />;
};

TxRow.contextTypes = {
  router: PropTypes.object.isRequired,
  tx: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired
};

export default injectIntl(TxRow);
