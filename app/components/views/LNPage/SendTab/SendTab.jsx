import { useSendTab } from "./hooks";
import { FormattedMessage as T, defineMessages } from "react-intl";
import { KeyBlueButton } from "buttons";
import { TextInput } from "inputs";
import styles from "./SendTab.module.css";
import { Subtitle, Balance, VerticalAccordion } from "shared";
import { DescriptionHeader } from "layout";
import ReactTimeout from "react-timeout";
import DecodedPayRequest from "./DecodedPayRequest";
import OutstandingPayment from "./OutstandingPayment";
import FailedPayment from "./FailedPayment";
import Payment from "./Payment";
import BalancesHeader from "../BalancesHeader";
import { Button, classNames } from "pi-ui";
import { wallet } from "wallet-preload-shim";

const messages = defineMessages({
  payReqInputLabel: {
    id: "ln.paymentsTab.payReq",
    defaultMessage: "Lightning Payment Request Code"
  },
  payReqInputPlaceholder: {
    id: "ln.paymentsTab.payReqPlaceholder",
    defaultMessage: "Request Code from an invoice"
  },
  payReqDecodeSuccessMsg: {
    id: "ln.paymentsTab.payReqDecodeSuccessMsg",
    defaultMessage: "Valid Lightning Request"
  }
});

export const SendTabHeader = () => (
  <DescriptionHeader
    description={
      <>
        <T
          id="ln.description.send"
          m="Paste the Payment Request Code to Send funds over Lightning Network."
        />
        <BalancesHeader />
      </>
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
    sendValue,
    onPayRequestChanged,
    onSendPayment,
    onSendValueChanged,
    isShowingDetails,
    selectedPaymentDetails,
    onToggleShowDetails,
    intl
  } = useSendTab(setTimeout);

  return (
    <div className={styles.container}>
      <Subtitle title={<T id="ln.paymentsTab.send" m="Send" />} />
      <div className={styles.lnSendPayment}>
        <TextInput
          newBiggerFontStyle
          className={styles.payReqInput}
          id="paymentRequestId"
          label={intl.formatMessage(messages.payReqInputLabel)}
          placeholder={intl.formatMessage(messages.payReqInputPlaceholder)}
          value={payRequest}
          inputClassNames={classNames(
            styles.addressInput,
            decodingError && styles.error,
            !!decodedPayRequest && styles.success
          )}
          onChange={(e) => onPayRequestChanged(e.target.value)}
          successMessage={intl.formatMessage(messages.payReqDecodeSuccessMsg)}
          showSuccess={!!decodedPayRequest}
          showErrors={!!decodingError}
          invalid={!!decodingError}
          invalidMessage={!!decodingError && decodingError}>
          {!payRequest ? (
            <Button
              kind="secondary"
              size="sm"
              className={styles.pasteButton}
              onClick={(e) => {
                e.preventDefault();
                onPayRequestChanged(wallet.readFromClipboard());
              }}>
              Paste
            </Button>
          ) : (
            <Button
              aria-label="Clear Address"
              kind="secondary"
              className={classNames(
                styles.clearAddressButton,
                !!decodedPayRequest && styles.success
              )}
              onClick={(e) => {
                e.preventDefault();
                onPayRequestChanged("");
              }}>
              <div />
            </Button>
          )}
        </TextInput>
        {!!decodedPayRequest && (
          <>
            <DecodedPayRequest
              decoded={decodedPayRequest}
              sendValue={sendValue}
              onSendValueChanged={onSendValueChanged}
            />
          </>
        )}
      </div>
      {!!decodedPayRequest && (
        <div className={styles.buttonContainer}>
          <KeyBlueButton onClick={onSendPayment}>
            <T id="ln.paymentsTab.sendBtn" m="Send" />
          </KeyBlueButton>
        </div>
      )}
      {Object.keys(outstandingPayments).length > 0 && (
        <div className={styles.listWrapper}>
          <Subtitle
            title={<T id="ln.paymentsTab.outstanding" m="Ongoing Payments" />}
          />
          <div className={styles.lnPaymentsList}>
            {Object.keys(outstandingPayments).map((ph) => (
              <OutstandingPayment
                payment={outstandingPayments[ph].decoded}
                key={`outstanding-${ph}`}
                tsDate={tsDate}
              />
            ))}
          </div>
        </div>
      )}
      {failedPayments.length > 0 && (
        <div className={styles.listWrapper}>
          <Subtitle
            title={<T id="ln.paymentsTag.failed" m="Failed Payments" />}
          />
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
        </div>
      )}
      {payments.length > 0 && (
        <div className={styles.listWrapper}>
          <Subtitle
            title={<T id="ln.paymentsTab.latestPayments" m="Latest Payments" />}
          />
          <div className={styles.lnPaymentsList}>
            {payments.map((p) => (
              <VerticalAccordion
                key={`accordion-${p.paymentHash}`}
                arrowClassName={styles.verticalAccordionArrow}
                header={<Payment payment={p} tsDate={tsDate} />}
                onToggleAccordion={() => onToggleShowDetails(p.paymentHash)}
                show={
                  p.paymentHash === selectedPaymentDetails && isShowingDetails
                }>
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
        </div>
      )}
    </div>
  );
};

export default ReactTimeout(SendTab);
