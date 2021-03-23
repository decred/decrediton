import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import styles from "./FailedPayment.module.css";

const FailedPayment = ({ payment, paymentError, tsDate }) => (
  <div className={styles.lnPayment}>
    <div>
      <div className={styles.value}>
        <Balance amount={payment.numAtoms} />
      </div>
    </div>
    <div>
      <div>
        <T
          id="ln.paymentsTab.failed.creationDate"
          m="{creationDate, date, medium} {creationDate, time, short}"
          values={{ creationDate: tsDate(payment.timestamp) }}
        />
      </div>
      <div className={styles.rhash}>{payment.paymentHash}</div>
    </div>
    <div></div>
    <div class={styles.paymentError}>{paymentError}</div>
  </div>
);

export default FailedPayment;
