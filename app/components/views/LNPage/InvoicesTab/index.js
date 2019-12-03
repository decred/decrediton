import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { lnPage } from "connectors";
import Page from "./Page";

export const InvoicesTabHeader = () =>
  <DescriptionHeader
    description={<T id="ln.description.invoices" m="Invoices (payment requests) created by this LN wallet." />}
  />;


@autobind
class InvoicesTab extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      atomValue: 0,
      memo: "",
      lastPayRequest: ""
    };
  }

  onValueChanged({ atomValue }) {
    this.setState({ atomValue });
  }

  onMemoChanged(e) {
    if (e.target.value.length > 639) {
      // This is the length limit for the memo field in a payment request.
      return;
    }

    this.setState({ memo: e.target.value });
  }

  onAddInvoice() {
    const { memo, atomValue } = this.state;
    this.setState({ lastPayRequest: "", lastError: null });
    this.props.addInvoice(memo, atomValue).then(payReq => {
      this.setState({ memo: "", value: 0, lastPayRequest: payReq.paymentRequest });
    }).catch(error => {
      this.setState({ lastError: error });
    });
  }

  render() {
    const { invoices, tsDate, addInvoiceAttempt } = this.props;
    const { memo, atomValue, lastPayRequest, lastError } = this.state;
    const { onValueChanged, onMemoChanged, onAddInvoice } = this;

    return (
      <Page
        invoices={invoices}
        tsDate={tsDate}
        value={atomValue}
        memo={memo}
        addInvoiceAttempt={addInvoiceAttempt}
        lastPayRequest={lastPayRequest}
        lastError={lastError}
        onValueChanged={onValueChanged}
        onMemoChanged={onMemoChanged}
        onAddInvoice={onAddInvoice}
      />
    );
  }
}

export default lnPage(InvoicesTab);
