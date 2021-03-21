import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import styles from "./OutstandingPayment.module.css";

const OutstandingPayment = ({ payment, tsDate }) => (
  <div className={styles.lnPayment}>
    <div>
      <div className={styles.value}>
        <Balance amount={payment.numAtoms} />
      </div>
    </div>
    <div>
      <div>
        <T
          id="ln.paymentsTab.outstanding.creationDate"
          m="{creationDate, date, medium} {creationDate, time, short}"
          values={{ creationDate: tsDate(payment.timestamp) }}
        />
      </div>
      <div className={styles.rhash}>{payment.paymentHash}</div>
    </div>
    <SimpleLoading />
  </div>
);

export default OutstandingPayment;
