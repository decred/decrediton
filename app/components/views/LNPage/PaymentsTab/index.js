import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { lnPage } from "connectors";
import Page from "./Page";
import ReactTimeout from "react-timeout";

export const PaymentsTabHeader = () =>
  <DescriptionHeader
    description={<T id="ln.description.payments" m="Payments sent from this LN wallet." />}
  />;

@autobind
class PaymentsTab extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      sendValueAtom: 0,
      payRequest: "",
      decodedPayRequest: null,
      decodingError: null,
      expired: false
    };
    this.lastDecodeTimer = null;
  }

  checkExpired() {
    const { decodedPayRequest } = this.state;
    if (!decodedPayRequest) return;


    const timeToExpire = (decodedPayRequest.timestamp + decodedPayRequest.expiry) * 1000 - Date.now();
    if (timeToExpire < 0) {
      this.setState({ expired: true });
    }
  }

  decodePayRequest() {
    this.lastDecodeTimer = null;
    if (!this.state.payRequest) {
      this.setState({ decodingError: null, decodedPayRequest: null });
      return;
    }
    this.props.decodePayRequest(this.state.payRequest).then(resp => {
      const timeToExpire = (resp.timestamp + resp.expiry) * 1000 - Date.now();
      const expired = timeToExpire < 0;
      if (!expired) {
        this.props.setTimeout(this.checkExpired, timeToExpire + 1000);
      }
      this.setState({ decodedPayRequest: resp, decodingError: null, expired });
    }).catch(error => {
      this.setState({ decodedPayRequest: null, decodingError: error });
    });
  }

  onPayRequestChanged(e) {
    this.setState({ payRequest: (""+e.target.value).trim(), decodedPayRequest: null,
      expired: false });
    if (this.lastDecodeTimer) {
      this.props.clearTimeout(this.lastDecodeTimer);
    }
    this.lastDecodeTimer = this.props.setTimeout(this.decodePayRequest, 1000);
  }

  onSendValueChanged({ atomValue }) {
    this.setState({ sendValueAtom: atomValue });
  }

  onSendPayment() {
    if (!this.state.payRequest || !this.state.decodedPayRequest) {
      return;
    }

    const { payRequest, sendValueAtom } = this.state;
    this.setState({ sending: true });
    this.props.sendPayment(payRequest, sendValueAtom).then(() => {
      this.setState({ sending: false, payRequest: "",
        decodedPayRequest: null, sendValue: 0 });
    }).catch(() => {
      this.setState({ sending: false });
    });
  }

  render() {
    const { payments, tsDate } = this.props;
    const { payRequest, decodedPayRequest, decodingError,
      expired, sending, sendValueAtom } = this.state;
    const { onPayRequestChanged, onSendPayment, onSendValueChanged } = this;

    return (
      <Page
        payments={payments}
        tsDate={tsDate}
        payRequest={payRequest}
        decodedPayRequest={decodedPayRequest}
        decodingError={decodingError}
        expired={expired}
        sending={sending}
        sendValue={sendValueAtom}
        onPayRequestChanged={onPayRequestChanged}
        onSendPayment={onSendPayment}
        onSendValueChanged={onSendValueChanged}
      />
    );
  }
}

export default lnPage(ReactTimeout(PaymentsTab));
