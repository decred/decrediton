import { FormattedMessage as T } from "react-intl";
import { Balance, LNInvoiceStatus } from "shared";
import styles from "./InvoiceRow.module.css";

const InvoiceRow = ({ invoice, tsDate, onClick }) => (
  <div className={styles.lnInvoice} onClick={onClick}>
    <div>
      <div className={styles.value}>
        <T
          id="ln.invoicesTab.invoice.value"
          m="Invoice for +{balance}"
          values={{
            balance: (
              <Balance
                amount={invoice.value}
                classNameWrapper={styles.balance}
              />
            )
          }}
        />
        <div className={styles.rhash}>{invoice.rHashHex}</div>
      </div>
      {!!(invoice.amtPaidAtoms && invoice.amtPaidAtoms !== invoice.value) && (
        <div>
          <Balance amount={invoice.amtPaidAtoms} />
        </div>
      )}
    </div>
    <div className={styles.status}>
      <LNInvoiceStatus status={invoice.status} />
    </div>
    <div className={styles.date}>
      <T
        id="ln.invoicesTab.invoice.creationDate"
        m="{creationDate, date, medium} {creationDate, time, short}"
        values={{ creationDate: tsDate(invoice.creationDate) }}
      />
    </div>
  </div>
);

export default InvoiceRow;
