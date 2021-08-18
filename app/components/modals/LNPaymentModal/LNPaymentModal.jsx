import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { Message } from "pi-ui";
import styles from "./LNPaymentModal.module.css";
import { Balance, LNPaymentStatus, DetailsTable, CopyableText } from "shared";
import { getPaymentDetails } from "./helpers";

const LNPaymentModal = ({ show, onCancelModal, tsDate, payment }) => (
  <Modal className={styles.modal} {...{ show, onCancelModal }}>
    <div
      className={styles.closeButton}
      onClick={onCancelModal}
      data-testid="lnpayment-close-button"
    />
    <div className={styles.title}>
      <T id="ln.paymentModal.title" m="Lightning Payment" />
    </div>
    <div className={styles.dataGrid}>
      <label>
        <T id="ln.paymentModal.sentAmount" m="Sent Amount" />
      </label>
      <label>
        <T id="ln.paymentModal.status" m="Status" />
      </label>
      <label>
        <T id="ln.paymentModal.date" m="Date" />
      </label>
      <label>
        <T id="ln.paymentModal.fee" m="Fee" />
      </label>
      <Balance amount={payment?.valueAtoms} classNameWrapper={styles.amount} />
      <div className={styles.status}>
        <LNPaymentStatus status={payment?.status} />
      </div>
      <div className={styles.date}>
        <T
          id="ln.paymentModal.creationDate"
          m="{creationDate, date, medium} {creationDate, time, short}"
          values={{ creationDate: tsDate(payment?.creationDate) }}
        />
      </div>
      <Balance amount={payment?.fee} classNameWrapper={styles.amount} />
    </div>
    {payment?.paymentRequest && (
      <>
        <div className={styles.requestCodeLabel}>
          <T
            id="ln.paymentModal.requestCodeLabel"
            m="Lightning Payment Request Code"
          />
        </div>
        <CopyableText
          tooltipPlacement="top"
          id="paymentRequest"
          truncate={false}>
          {payment.paymentRequest}
        </CopyableText>
      </>
    )}
    {payment.paymentError && (
      <Message kind="error">{payment.paymentError}</Message>
    )}
    <DetailsTable
      data={getPaymentDetails(payment, tsDate)}
      className={styles.details}
      title={<T id="ln.paymentModal.details" m="Details" />}
      expandable
    />
  </Modal>
);
export default LNPaymentModal;
