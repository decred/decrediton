import { useSendTab } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";
import { TextInput } from "inputs";
import styles from "./SendTab.module.css";
import { Subtitle, Balance, VerticalAccordion } from "shared";
import { DescriptionHeader } from "layout";
import ReactTimeout from "react-timeout";
import BalanceHeader from "../BalanceHeader/BalanceHeader";
import DecodedPayRequest from "./DecodedPayRequest";
import OutstandingPayment from "./OutstandingPayment";
import FailedPayment from "./FailedPayment";
import Payment from "./Payment";

export const SendTabHeader = () => (
  <DescriptionHeader
    description={
      <T id="ln.description.payments" m="Payments sent from this LN wallet." />
    }
  />
);

const SendTab = ({ setTimeout }) => {
  const {
    payments,
    outstandingPayments,
    failedPayments,
    tsDate,
    payRequest,
    decodedPayRequest,
    decodingError,
    expired,
    sendValue,
    onPayRequestChanged,
    onSendPayment,
    onSendValueChanged,
    isShowingDetails,
    selectedPaymentDetails,
    onToggleShowDetails,
    channelBalances
  } = useSendTab(setTimeout);

  return (
    <>
      <Subtitle title={<T id="ln.paymentsTab.balanceHeader" m="Balance" />} />
      <BalanceHeader channelBalances={channelBalances} />
      <Subtitle
        title={<T id="ln.paymentsTab.sendPayment" m="Send Payment" />}
      />
      <div className={styles.lnSendPayment}>
        <div>
          <T id="ln.paymentsTab.payReq" m="Payment Request" />
          <TextInput
            id="paymentRequestId"
            value={payRequest}
            onChange={onPayRequestChanged}
          />
        </div>
        {!!decodingError && (
          <div className={styles.decodingError}>{decodingError || ""}</div>
        )}
        {!!decodedPayRequest && (
          <>
            <DecodedPayRequest
              decoded={decodedPayRequest}
              tsDate={tsDate}
              expired={expired}
              sendValue={sendValue}
              onSendValueChanged={onSendValueChanged}
            />
            <KeyBlueButton onClick={onSendPayment}>
              <T id="ln.paymentsTab.sendBtn" m="Send" />
            </KeyBlueButton>
          </>
        )}
      </div>
      {Object.keys(outstandingPayments).length > 0 && (
        <Subtitle
          title={<T id="ln.paymentsTab.outstanding" m="Ongoing Payments" />}
        />
      )}
      <div className={styles.lnPaymentsList}>
        {Object.keys(outstandingPayments).map((ph) => (
          <OutstandingPayment
            payment={outstandingPayments[ph].decoded}
            key={`outstanding-${ph}`}
            tsDate={tsDate}
          />
        ))}
      </div>
      {failedPayments.length > 0 && (
        <Subtitle
          title={<T id="ln.paymentsTag.failed" m="Failed Payments" />}
        />
      )}
      <div className={styles.lnPaymentsList}>
        {failedPayments.map((p) => (
          <FailedPayment
            payment={p.decoded}
            paymentError={p.paymentError}
            key={`failed-${p.decoded.paymentHash}`}
            tsDate={tsDate}
          />
        ))}
      </div>
      {payments.length > 0 && (
        <Subtitle
          title={<T id="ln.paymentsTab.latestPayments" m="Latest Payments" />}
        />
      )}
      <div className={styles.lnPaymentsList}>
        {payments.map((p) => (
          <VerticalAccordion
            key={`accordion-${p.paymentHash}`}
            arrowClassName={styles.verticalAccordionArrow}
            header={<Payment payment={p} tsDate={tsDate} />}
            onToggleAccordion={() => onToggleShowDetails(p.paymentHash)}
            show={p.paymentHash === selectedPaymentDetails && isShowingDetails}>
            <div className={styles.paymentDetails}>
              <span>PayReq</span>
              <div>
                <b>{p.paymentRequest}</b>
              </div>
              {p.htlcsList.map((htlc, i) => (
                <div key={`htlc-${i}`} className={styles.htlc}>
                  <span>HTLC {i}</span>
                  <hr />
                  <div className={styles.paymentDetailsGrid}>
                    <span>Status</span>
                    <span>{htlc.status}</span>
                    <span>Total Amount</span>
                    <Balance amount={htlc.route.totalAmt} />
                    <span>Total fees</span>
                    <Balance amount={htlc.route.totalFees} />
                  </div>
                  <span>Route</span>
                  <div className={styles.paymentRouteGrid}>
                    <span>Hop</span>
                    <span>Fee</span>
                    <span>PubKey</span>
                    {htlc.route.hopsList.map((hop, i) => (
                      <React.Fragment key={`hop-${+i}`}>
                        <span>{i}</span>
                        <span>
                          <Balance amount={hop.fee} />
                        </span>
                        <span>{hop.pubKey}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </VerticalAccordion>
        ))}
      </div>
    </>
  );
};

export default ReactTimeout(SendTab);
