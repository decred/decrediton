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

const TxRow = ({ tx, overview, tsDate, intl, className }, { router }) => {

  return <RegularTxRow
      {...{
        ...tx,
        className,
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
