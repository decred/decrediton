import { FormattedMessage as T } from "react-intl";
import { Balance, FormattedRelative } from "shared";
import { KeyBlueButton } from "buttons";
import { TextInput, DcrInput } from "inputs";

const Payment = ({ payment, tsDate }) => (
  <div className="ln-payment">
    <div>
      <div className="value"><Balance amount={payment.valueAtoms} /></div>
      <div className="fee"><Balance amount={payment.fee} /></div>
    </div>
    <div>
      <div>
        <T id="ln.paymentsTab.payment.creationDate" m="{creationDate, date, medium} {creationDate, time, short}"
          values={ { creationDate: tsDate(payment.creationDate) } } />
      </div>
      <div className="rhash">{payment.paymentHash}</div>
    </div>
  </div>
);

const EmptyDescription = () =>
  <div className="empty-description">
    <T id="ln.paymentsTab.emptyDescr" m="(empty description)" />
  </div>;

const ExpiryTime = ({ expired, decoded, tsDate }) => (
  <div className={ expired ? "expiry expired" : "expiry" }>
    { expired
      ? <T id="ln.paymentsTab.expired" m="Expired {relTime}"
        values={ { relTime: <FormattedRelative value={tsDate(decoded.expiry + decoded.timestamp)} /> } }/>
      : <T id="ln.paymentsTab.expires" m="Expires {relTime}"
        values={ { relTime: <FormattedRelative value={tsDate(decoded.expiry + decoded.timestamp)} /> } }/>
    }
  </div>
);

const DecodedPayRequest = ({ decoded, tsDate, expired, sendValue, onSendValueChanged }) => (
  <div className="decoded-payreq">
    { decoded.numAtoms
      ? <div className="num-atoms"><Balance amount={decoded.numAtoms} /></div>
      : <DcrInput amount={sendValue} onChangeAmount={onSendValueChanged} />
    }
    { decoded.description
      ? <div className="description">{decoded.description}</div>
      : <EmptyDescription/>
    }
    <ExpiryTime expired={expired} decoded={decoded} tsDate={tsDate} />
    <div className="dest-details">
      <T id="ln.paymentsTab.destLabel" m="Destination" />
      <div className="dest">{decoded.destination}</div>
      <T id="ln.paymentsTab.hashLabel" m="Payment Hash" />
      <div className="rhash">{decoded.paymentHash}</div>
    </div>
  </div>
);

export default ({
  payments,
  tsDate,
  payRequest,
  decodedPayRequest,
  decodingError,
  expired,
  sending,
  sendValue,
  onPayRequestChanged,
  onSendPayment,
  onSendValueChanged
}) => (
  <>
    <h2 className="ln-payments-subheader"><T id="ln.paymentsTab.sendPayment" m="Send Payment" /></h2>

    <div className="ln-send-payment">
      <div className="payreq">
        <T id="ln.paymentsTab.payReq" m="Payment Request" />
        <TextInput disabled={sending} value={payRequest} onChange={onPayRequestChanged} />
      </div>
      { decodingError
        ? <div className="decoding-error">{""+decodingError}</div>
        : null
      }
      { decodedPayRequest
        ? <>
          <DecodedPayRequest
            decoded={decodedPayRequest}
            tsDate={tsDate}
            expired={expired}
            sendValue={sendValue}
            onSendValueChanged={onSendValueChanged}
          />
          <KeyBlueButton loading={sending} disabled={sending || expired} className="sendpayment" onClick={onSendPayment}>
            <T id="ln.paymentsTab.sendBtn" m="Send" />
          </KeyBlueButton>
        </>
        : null
      }
    </div>


    <h2 className="ln-payments-subheader"><T id="ln.paymentsTab.latestPayments" m="Latest Payments" /></h2>

    <div className="ln-payments-list">
      { payments.map(p => <Payment payment={p} key={p.paymentHash} tsDate={tsDate} />) }
    </div>
  </>
);
