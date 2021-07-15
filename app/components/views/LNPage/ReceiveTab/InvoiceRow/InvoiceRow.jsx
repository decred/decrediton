import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import { StatusTag } from "pi-ui";
import styles from "./InvoiceRow.module.css";

const InvoiceRow = ({ invoice, tsDate }) => (
  <div className={styles.lnInvoice}>
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
      {invoice.status === "settled" ? (
        <StatusTag type="greenCheck" text="Received" />
      ) : invoice.status === "expired" ? (
        <StatusTag type="grayNegative" text="Expired" />
      ) : invoice.status === "canceled" ? (
        <StatusTag type="orangeNegativeCircled" text="Canceled" />
      ) : (
        <StatusTag type="bluePending" text="Not Paid Yet" />
      )}
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
