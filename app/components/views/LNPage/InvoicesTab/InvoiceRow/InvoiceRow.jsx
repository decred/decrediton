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
    <div>
      <div className={styles.value}>
        <Balance amount={invoice.value} />
      </div>
      {!!(invoice.amtPaidAtoms && invoice.amtPaidAtoms !== invoice.value) && (
        <div>
          <Balance amount={invoice.amtPaidAtoms} />
        </div>
      )}
    </div>
    <div>
      <div className={styles.memo}>{invoice.memo}</div>
      <div className={styles.rhash}>{invoice.rHashHex}</div>
    </div>
    <div>
      <div>
        <T
          id="ln.invoicesTab.invoice.creationDate"
          m="{creationDate, date, medium} {creationDate, time, short}"
          values={{ creationDate: tsDate(invoice.creationDate) }}
        />
      </div>
      {!!invoice.settleDate && (
        <div>
          <T
            id="ln.invoicesTab.invoice.settleDate"
            m="{settleDate, date, medium} {settleDate, time, short}"
            values={{ settleDate: tsDate(invoice.settleDate) }}
          />
        </div>
      )}
    </div>
  </div>
);

export default InvoiceRow;
