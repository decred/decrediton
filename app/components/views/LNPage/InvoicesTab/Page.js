import { FormattedMessage as T } from "react-intl";
import { Balance, CopyToClipboard } from "shared";
import { KeyBlueButton } from "buttons";
import { TextInput, DcrInput } from "inputs";

const InvoiceRow = ({ invoice, tsDate }) =>  (
  <div className={ [ "ln-invoice", "status-" + invoice.status ].join(" ") }>
    <div className="values-wrapper">
      <div className="value"><Balance amount={invoice.value} /></div>
      { invoice.amtPaidAtoms &&
        (invoice.amtPaidAtoms !== invoice.value)
        ? <div className="amtpaid"><Balance amount={invoice.amtPaidAtoms} /></div>
        : null}
    </div>
    <div className="memo-wrapper">
      <div className="memo">{invoice.memo}</div>
      <div className="rhash">{invoice.rHashHex}</div>
    </div>
    <div className="dates-wrapper">
      <div className="creationdate">
        <T id="ln.invoicesTab.invoice.creationDate" m="{creationDate, date, medium} {creationDate, time, short}"
          values={ { creationDate: tsDate(invoice.creationDate) } } />
      </div>
      { invoice.settleDate
        ? <div className="settledate">
          <T id="ln.invoicesTab.invoice.settleDate" m="{settleDate, date, medium} {settleDate, time, short}"
            values={ { settleDate: tsDate(invoice.settleDate) } } />
        </div>
        : null
      }

    </div>
  </div>
);

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
    <h2 className="ln-invoice-subheader"><T id="ln.invoicesTab.addInvoiceHeader" m="Add Invoice" /></h2>

    <div className="ln-add-invoice">
      <div className="memo">
        <T id="ln.invoicesTab.addInvoice.memo" m="Description" />
        <TextInput value={memo} onChange={onMemoChanged} />
      </div>
      <div className="value">
        <T id="ln.invoicesTab.addInvoice.value" m="Value" />
        <DcrInput amount={value} onChangeAmount={onValueChanged} />
      </div>
      <KeyBlueButton onClick={onAddInvoice} disabled={addInvoiceAttempt}>+</KeyBlueButton>
      { !lastPayRequest
        ? null
        : <>
          <div className="last-pay-request">
            {lastPayRequest}
          </div>
          <CopyToClipboard textToCopy={lastPayRequest} />
        </>
      }
      { !lastError
        ? null
        : <>
          <div className="last-error">
            {"" + lastError}
          </div>
        </>
      }
    </div>

    <h2 className="ln-invoice-subheader"><T id="ln.invoicesTab.invoicesHeader" m="Latest Invoices" /></h2>
    <div className="ln-invoice-list">
      { invoices.map(inv => <InvoiceRow key={inv.addIndex} invoice={inv} tsDate={tsDate} />) }
    </div>
  </>
);
