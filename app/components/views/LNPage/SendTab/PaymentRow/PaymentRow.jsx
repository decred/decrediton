import { FormattedMessage as T } from "react-intl";
import { Balance, LNPaymentStatus, TruncatedText } from "shared";
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
        <div className={styles.paymentHash}>
          <TruncatedText text={payment.paymentHash} max={40} />
        </div>
      </div>
    </div>
    <div className={styles.status}>
      <LNPaymentStatus status={payment.status} />
    </div>
    <div className={styles.date}>
      <T
        id="ln.sendTab.invoice.creationDate"
        m="{creationDate, date, medium} {creationDate, time, short}"
        values={{ creationDate: tsDate(payment.creationDate) }}
      />
    </div>
  </div>
);

export default PaymentRow;
