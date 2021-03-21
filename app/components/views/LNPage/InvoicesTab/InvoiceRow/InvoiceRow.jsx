import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import { classNames } from "pi-ui";
import styles from "./InvoiceRow.module.css";

const InvoiceRow = ({ invoice, tsDate }) => (
  <div
    className={classNames(
      styles.lnInvoice,
      invoice.status === "expired"
        ? styles.statusExpired
        : invoice.status === "settled"
        ? styles.statusSettled
        : styles.statusOpen
    )}>
    <div className="values-wrapper">
      <div className={styles.value}>
        <Balance amount={invoice.value} />
      </div>
      {invoice.amtPaidAtoms && invoice.amtPaidAtoms !== invoice.value ? (
        <div className="amtpaid">
          <Balance amount={invoice.amtPaidAtoms} />
        </div>
      ) : null}
    </div>
    <div className="memo-wrapper">
      <div className={styles.memo}>{invoice.memo}</div>
      <div className={styles.rhash}>{invoice.rHashHex}</div>
    </div>
    <div className="dates-wrapper">
      <div className="creationdate">
        <T
          id="ln.invoicesTab.invoice.creationDate"
          m="{creationDate, date, medium} {creationDate, time, short}"
          values={{ creationDate: tsDate(invoice.creationDate) }}
        />
      </div>
      {invoice.settleDate ? (
        <div className="settledate">
          <T
            id="ln.invoicesTab.invoice.settleDate"
            m="{settleDate, date, medium} {settleDate, time, short}"
            values={{ settleDate: tsDate(invoice.settleDate) }}
          />
        </div>
      ) : null}
    </div>
  </div>
);

export default InvoiceRow;
