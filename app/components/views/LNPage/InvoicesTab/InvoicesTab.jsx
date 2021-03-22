import { FormattedMessage as T } from "react-intl";
import { CopyToClipboard, Subtitle } from "shared";
import { KeyBlueButton } from "buttons";
import { DescriptionHeader } from "layout";
import { TextInput, DcrInput } from "inputs";
import styles from "./InvoicesTab.module.css";
import InvoiceRow from "./InvoiceRow/InvoiceRow";
import BalanceHeader from "../BalanceHeader/BalanceHeader";
import { useInvoicesTab } from "./hooks";

export const InvoicesTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="ln.description.invoices"
        m="Invoices (payment requests) created by this LN wallet."
      />
    }
  />
);

const InvoicesTab = () => {
  const {
    invoices,
    tsDate,
    value,
    memo,
    addInvoiceAttempt,
    lastPayRequest,
    lastError,
    onValueChanged,
    onMemoChanged,
    onAddInvoice,
    channelBalances
  } = useInvoicesTab();

  return (
    <>
      <Subtitle title={<T id="ln.invoicesTab.balanceHeader" m="Balance" />} />
      <BalanceHeader channelBalances={channelBalances} />
      <Subtitle
        title={<T id="ln.invoicesTab.addInvoiceHeader" m="Add Invoice" />}
      />
      <div className={styles.lnAddInvoice}>
        <div className="memo">
          <T id="ln.invoicesTab.addInvoice.memo" m="Description" />
          <TextInput value={memo} onChange={onMemoChanged} />
        </div>
        <div className="value">
          <T id="ln.invoicesTab.addInvoice.value" m="Value" />
          <DcrInput amount={value} onChangeAmount={onValueChanged} />
        </div>
        <KeyBlueButton
          className={styles.invoiceButton}
          onClick={onAddInvoice}
          disabled={addInvoiceAttempt}>
          +
        </KeyBlueButton>
        {!!lastPayRequest && (
          <>
            <div className={styles.lastPayRequest}>{lastPayRequest}</div>
            <CopyToClipboard
              className={styles.clipboardBox}
              textToCopy={lastPayRequest}
            />
          </>
        )}
        {!!lastError && (
          <>
            <div className={styles.lastError}>{"" + lastError}</div>
          </>
        )}
      </div>

      {invoices > 0 && (
        <Subtitle
          title={<T id="ln.invoicesTab.invoicesHeader" m="Latest Invoices" />}
        />
      )}
      <div className="ln-invoice-list">
        {invoices.map((inv) => (
          <InvoiceRow key={inv.addIndex} invoice={inv} tsDate={tsDate} />
        ))}
      </div>
    </>
  );
};

export default InvoicesTab;
