import { FormattedMessage as T } from "react-intl";
import { CopyToClipboard, Subtitle } from "shared";
import { KeyBlueButton } from "buttons";
import { DescriptionHeader } from "layout";
import { TextInput, DcrInput } from "inputs";
import styles from "./ReceiveTab.module.css";
import InvoiceRow from "./InvoiceRow/InvoiceRow";
import BalancesHeader from "../BalancesHeader";
import { useReceiveTab } from "./hooks";

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
    lastPayRequest,
    lastError,
    onValueChanged,
    onMemoChanged,
    onAddInvoice
  } = useReceiveTab();

  return (
    <div className={styles.container}>
      <Subtitle title={<T id="ln.invoicesTab.balanceHeader" m="Balance" />} />
      <Subtitle
        title={<T id="ln.invoicesTab.addInvoiceHeader" m="Add Invoice" />}
      />
      <div className={styles.lnAddInvoice}>
        <div className={styles.memo}>
          <T id="ln.invoicesTab.addInvoice.memo" m="Description" />
          <TextInput id="descInput" value={memo} onChange={onMemoChanged} />
        </div>
        <div className={styles.value}>
          <T id="ln.invoicesTab.addInvoice.value" m="Value" />
          <DcrInput
            id="valueInput"
            amount={value}
            onChangeAmount={onValueChanged}
          />
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
      <div>
        {invoices.map((inv) => (
          <InvoiceRow key={inv.addIndex} invoice={inv} tsDate={tsDate} />
        ))}
      </div>
    </div>
  );
};

export default ReceiveTab;
