import { FormattedMessage as T, defineMessages } from "react-intl";
import { Subtitle } from "shared";
import { DescriptionHeader } from "layout";
import { TextInput, DcrInput } from "inputs";
import styles from "./ReceiveTab.module.css";
import InvoiceRow from "./InvoiceRow";
import BalancesHeader from "../BalancesHeader";
import { useReceiveTab } from "./hooks";
import { PiUiButton } from "buttons";
import { LNInvoiceModal } from "modals";

const messages = defineMessages({
  requestedAmountLabel: {
    id: "ln.receiveTab.requestedAmountLabel",
    defaultMessage: "Requested Amount"
  },
  requestedAmountPlaceholder: {
    id: "ln.receiveTab.requestedAmountPlaceholder",
    defaultMessage: "Amount"
  },
  descriptionLabel: {
    id: "ln.receiveTab.descriptionLabel",
    defaultMessage: "Description"
  },
  descriptionPlaceholder: {
    id: "ln.receiveTab.descriptionPlaceholder",
    defaultMessage: "Message for Recepient"
  }
});

export const ReceiveTabHeader = () => (
  <DescriptionHeader
    description={
      <>
        <T
          id="ln.description.receive"
          m="Generate a Lightning Invoice to receive DCR funds over the Lightning Network."
        />
        <BalancesHeader />
      </>
    }
  />
);

const ReceiveTab = () => {
  const {
    invoices,
    tsDate,
    value,
    memo,
    addInvoiceAttempt,
    cancelInvoiceAttempt,
    lastError,
    onValueChanged,
    onMemoChanged,
    onAddInvoice,
    onCancelInvoice,
    intl,
    amountError,
    isFormValid,
    selectedInvoice,
    setSelectedInvoice
  } = useReceiveTab();

  return (
    <div className={styles.container}>
      <Subtitle title={<T id="ln.receiveTab.receiveHeader" m="Receive" />} />
      <div className={styles.lnAddInvoice}>
        <div className={styles.invoiceForm}>
          <DcrInput
            newBiggerFontStyle
            id="valueInput"
            amount={value}
            className={styles.amountInput}
            onChangeAmount={onValueChanged}
            label={intl.formatMessage(messages.requestedAmountLabel)}
            placeholder={intl.formatMessage(
              messages.requestedAmountPlaceholder
            )}
            showErrors={amountError && amountError}
            invalid={amountError && amountError}
            invalidMessage={amountError && amountError}
          />
          <TextInput
            newBiggerFontStyle
            id="descInput"
            value={memo}
            onChange={onMemoChanged}
            className={styles.descInput}
            label={intl.formatMessage(messages.descriptionLabel)}
            placeholder={intl.formatMessage(messages.descriptionPlaceholder)}
          />
        </div>
        {!!lastError && (
          <div className={styles.lastError}>{`${lastError}`}</div>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <PiUiButton
          onClick={onAddInvoice}
          disabled={addInvoiceAttempt || !isFormValid}>
          <T id="ln.receiveTab.createInvoice" m="Create Invoice" />
        </PiUiButton>
      </div>
      {invoices && invoices.length > 0 && (
        <Subtitle
          title={
            <T id="ln.receiveTab.lightingInvoices" m="Lightning Invoices" />
          }
        />
      )}
      <div>
        {invoices.map((invoice) => (
          <InvoiceRow
            key={invoice.addIndex}
            invoice={invoice}
            tsDate={tsDate}
            onClick={() => setSelectedInvoice(invoice)}
          />
        ))}
      </div>
      {selectedInvoice && (
        <LNInvoiceModal
          show={!!selectedInvoice}
          onCancelModal={() => setSelectedInvoice(null)}
          onCancelInvoice={() => onCancelInvoice(selectedInvoice)}
          cancelInvoiceAttempt={cancelInvoiceAttempt}
          invoice={selectedInvoice}
          tsDate={tsDate}
        />
      )}
    </div>
  );
};

export default ReceiveTab;
