import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { CopyableText, classNames } from "pi-ui";
import styles from "./LNInvoiceModal.module.css";
import { Balance, LNInvoiceStatus, FormattedRelative } from "shared";
import { PiUiButton } from "buttons";
import {
  INVOICE_STATUS_OPEN,
  INVOICE_STATUS_SETTLED,
  INVOICE_STATUS_CANCELED,
  INVOICE_STATUS_EXPIRED
} from "constants";
import InvoiceDetails from "./InvoiceDetails";

const LNInvoiceModal = ({
  show,
  onCancelModal,
  tsDate,
  cancelInvoiceAttempt,
  invoice,
  onCancelInvoice
}) => {
  const isCancelButtonDisabled =
    cancelInvoiceAttempt || invoice?.status !== INVOICE_STATUS_OPEN;
  return (
    <Modal className={styles.modal} {...{ show, onCancelModal }}>
      <div
        className={styles.closeButton}
        onClick={onCancelModal}
        data-testid="lninvoice-close-button"
      />
      <div className={styles.title}>
        <T id="ln.invoiceModal.title" m="Lightning Payment Request" />
      </div>
      <div className={styles.dataGrid}>
        <label>
          <T id="ln.invoiceModal.requestedAmount" m="Requested Amount" />
        </label>
        <label>
          <T id="ln.invoiceModal.status" m="Status" />
        </label>
        <label>
          <T id="ln.invoiceModal.date" m="Date" />
        </label>
        <label>
          {invoice.status === INVOICE_STATUS_SETTLED ? (
            <T id="ln.invoiceModal.settleDateLabel" m="Settle Date" />
          ) : (
            <T id="ln.invoiceModal.expirationTime" m="Expiration Time" />
          )}
        </label>
        <Balance amount={invoice?.value} classNameWrapper={styles.amount} />
        <div className={styles.status}>
          <LNInvoiceStatus status={invoice?.status} />
        </div>
        <div className={styles.date}>
          <T
            id="ln.invoicesModal.creationDate"
            m="{creationDate, date, medium} {creationDate, time, short}"
            values={{ creationDate: tsDate(invoice?.creationDate) }}
          />
        </div>
        {invoice.status === INVOICE_STATUS_SETTLED ? (
          <T
            id="ln.invoicesModal.settleDate"
            m="{settleDate, date, medium} {settleDate, time, short}"
            values={{ settleDate: tsDate(invoice?.settleDate) }}
          />
        ) : (
          <>
            {invoice?.creationDate + invoice?.expiry < Date.now() / 1000 ? (
              <T id="ln.invoicesModal.expired" m="Expired " />
            ) : (
              <T id="ln.invoicesModal.expires" m="Expires " />
            )}
            <FormattedRelative
              value={tsDate(invoice?.creationDate + invoice?.expiry)}
            />
          </>
        )}
        <div className={styles.cancelInvoiceWrapper}>
          <PiUiButton
            className={classNames(
              styles.cancelInvoice,
              isCancelButtonDisabled && styles.disabled
            )}
            onClick={onCancelInvoice}
            disabled={isCancelButtonDisabled}>
            <T id="ln.invoicesModal.cancelInvoice" m="Cancel Invoice" />
          </PiUiButton>
        </div>
      </div>
      <div className={styles.requestCodeLabel}>
        <T
          id="ln.invoicesModal.requestCodeLabel"
          m="Lightning Payment Request Code (Send this to Payer)"
        />
      </div>
      {invoice?.status === INVOICE_STATUS_CANCELED ||
      invoice?.status === INVOICE_STATUS_EXPIRED ? (
        <div className={styles.paymentRequest}>{invoice?.paymentRequest}</div>
      ) : (
        <CopyableText
          tooltipPlacement="top"
          id="paymentRequest"
          truncate={false}>
          {invoice?.paymentRequest}
        </CopyableText>
      )}
      <InvoiceDetails {...{ invoice, tsDate }} className={styles.details}/>
    </Modal>
  );
};

export default LNInvoiceModal;
