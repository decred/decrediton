import { useChannelBalances } from "./index";
import { FormattedMessage as T } from "react-intl";
import { Balance, CopyToClipboard, Subtitle } from "shared";
import { KeyBlueButton } from "buttons";
import { TextInput, DcrInput } from "inputs";
import styles from "./InvoicesTab.module.css";

const InvoiceRow = ({ invoice, tsDate }) => (
  <div className={`${styles.lnInvoice} ${
      invoice.status === "expired" ? styles.statusExpired
      : invoice.status === "settled" ? styles.statusSettled
      : styles.statusOpen
    }`}>
    <div className="values-wrapper">
      <div className={styles.value}>
        <Balance amount={invoice.value} />
      </div>
      {invoice.amtPaidAtoms && invoice.amtPaidAtoms !== invoice.value ? (
        <div className="amtpaid">
          <Balance amount={invoice.amtPaidAtoms} />
        </div>
      ) : null}
    </div>
    <div className="memo-wrapper">
      <div className={styles.memo}>{invoice.memo}</div>
      <div className={styles.rhash}>{invoice.rHashHex}</div>
    </div>
    <div className="dates-wrapper">
      <div className="creationdate">
        <T
          id="ln.invoicesTab.invoice.creationDate"
          m="{creationDate, date, medium} {creationDate, time, short}"
          values={{ creationDate: tsDate(invoice.creationDate) }}
        />
      </div>
      {invoice.settleDate ? (
        <div className="settledate">
          <T
            id="ln.invoicesTab.invoice.settleDate"
            m="{settleDate, date, medium} {settleDate, time, short}"
            values={{ settleDate: tsDate(invoice.settleDate) }}
          />
        </div>
      ) : null}
    </div>
  </div>
);

const BalanceHeader = () => {
  const { channelBalances } = useChannelBalances();
  return(
    <div className={styles.balanceHeader}>
      <div className={`${styles.balanceTile} ${
        channelBalances.maxInboundAmount === 0 ?
          styles.zeroFunds
          :styles.hasInbound}
        `}>
        <div className={styles.balanceValue}>
          <Balance amount={channelBalances.maxInboundAmount} />
        </div>
        <T
          id="ln.invoicesTab.balance.maxReceivable"
          m="Max. Receivable"
        />
      </div>
    </div>
  );
};

export default ({
  invoices,
  tsDate,
  memo,
  value,
  lastPayRequest,
  addInvoiceAttempt,
  lastError,
  onMemoChanged,
  onValueChanged,
  onAddInvoice
}) => (
  <>
    <Subtitle title={
      <T id="ln.invoicesTab.balanceHeader" m="Balance" />
    } />
    <BalanceHeader />
    <Subtitle
      title={
        <T id="ln.invoicesTab.addInvoiceHeader" m="Add Invoice" />
      } />
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
      {!lastPayRequest ? null : (
        <>
          <div className={styles.lastPayRequest}>{lastPayRequest}</div>
          <CopyToClipboard
            className={styles.clipboardBox}
            textToCopy={lastPayRequest} />
        </>
      )}
      {!lastError ? null : (
        <>
          <div className={styles.lastError}>{"" + lastError}</div>
        </>
      )}
    </div>

    {invoices > 0 ? (
    <Subtitle
      title={
        <T id="ln.invoicesTab.invoicesHeader" m="Latest Invoices" />
      } />) : null }
    <div className="ln-invoice-list">
      {invoices.map((inv) => (
        <InvoiceRow key={inv.addIndex} invoice={inv} tsDate={tsDate} />
      ))}
    </div>
  </>
);
