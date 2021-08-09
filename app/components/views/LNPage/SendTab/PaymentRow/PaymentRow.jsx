import { FormattedMessage as T } from "react-intl";
import { Balance, LNPaymentStatus } from "shared";
import styles from "./PaymentRow.module.css";

const PaymentRow = ({ payment, tsDate, onClick }) => (
  <div className={styles.payment} onClick={onClick}>
    <div>
      <div className={styles.value}>
        <T
          id="ln.sendTab.payment.value"
          m="Sent Payment {balance}"
          values={{
            balance: (
              <Balance
                amount={payment.valueAtoms}
                classNameWrapper={styles.balance}
              />
            )
          }}
        />
        <div className={styles.paymentHash}>{payment.paymentHash}</div>
      </div>
    </div>
    <div className={styles.status}>
      <LNPaymentStatus status={payment.status} />
    </div>
    <div className={styles.date}>
      <T
        id="ln.invoicesTab.invoice.creationDate"
        m="{creationDate, date, medium} {creationDate, time, short}"
        values={{ creationDate: tsDate(payment.creationDate) }}
      />
    </div>
  </div>
);

export default PaymentRow;
