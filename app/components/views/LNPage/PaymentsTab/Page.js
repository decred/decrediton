import { usePaymentsTab } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";
import { TextInput, DcrInput } from "inputs";
import { SimpleLoading } from "indicators";
import { CopyableText } from "pi-ui";
import styles from "./PaymentsTab.module.css";
import {
  Subtitle,
  Balance,
  FormattedRelative,
  VerticalAccordion
} from "shared";

const Payment = ({
  payment,
  tsDate
}) => (
    <div className={styles.lnPayment}>
      <div>
        <div className={styles.value}>
          <Balance amount={payment.valueAtoms} />
        </div>
        <div className="fee">
          <Balance amount={payment.fee} />
        </div>
      </div>
      <div>
        <div>
          <T
            id="ln.paymentsTab.payment.creationDate"
            m="{creationDate, date, medium} {creationDate, time, short}"
            values={{ creationDate: tsDate(payment.creationDate) }}
          />
        </div>
        <div className={styles.rhash}>{payment.paymentHash}</div>
      </div>
    </div>
  );

const OutstandingPayment = ({ payment, tsDate }) => (
  <div className={styles.lnPayment}>
    <div>
      <div className={styles.value}>
        <Balance amount={payment.numAtoms} />
      </div>
    </div>
    <div>
      <div>
        <T
          id="ln.paymentsTab.outstanding.creationDate"
          m="{creationDate, date, medium} {creationDate, time, short}"
          values={{ creationDate: tsDate(payment.timestamp) }}
        />
      </div>
      <div className={styles.rhash}>{payment.paymentHash}</div>
    </div>
    <SimpleLoading />
  </div>
);

const FailedPayment = ({ payment, paymentError, tsDate }) => (
  <div className={styles.lnPayment}>
    <div>
      <div className={styles.value}>
        <Balance amount={payment.numAtoms} />
      </div>
    </div>
    <div>
      <div>
        <T
          id="ln.paymentsTab.failed.creationDate"
          m="{creationDate, date, medium} {creationDate, time, short}"
          values={{ creationDate: tsDate(payment.timestamp) }}
        />
      </div>
      <div className={styles.rhash}>{payment.paymentHash}</div>
    </div>
    <div></div>
    <div class={styles.paymentError}>{paymentError}</div>
  </div>
);

const EmptyDescription = () => (
  <div className="empty-description">
    <T id="ln.paymentsTab.emptyDescr" m="(empty description)" />
  </div>
);

const ExpiryTime = ({ expired, decoded, tsDate }) => (
  <div className={expired ? "expiry expired" : "expiry"}>
    {expired ? (
      <T
        id="ln.paymentsTab.expired"
        m="Expired {relTime}"
        values={{
          relTime: (
            <FormattedRelative
              value={tsDate(decoded.expiry + decoded.timestamp)}
            />
          )
        }}
      />
    ) : (
        <T
          id="ln.paymentsTab.expires"
          m="Expires {relTime}"
          values={{
            relTime: (
              <FormattedRelative
                value={tsDate(decoded.expiry + decoded.timestamp)}
              />
            )
          }}
        />
      )}
  </div>
);

const DecodedPayRequest = ({
  decoded,
  tsDate,
  expired,
  sendValue,
  onSendValueChanged
}) => (
    <div className={styles.decodedPayreq}>
      {decoded.numAtoms ? (
        <div className={styles.numAtoms}>
          <Balance amount={decoded.numAtoms} />
        </div>
      ) : (
          <DcrInput amount={sendValue} onChangeAmount={onSendValueChanged} />
        )}
      {decoded.description ? (
        <div className={styles.description}>{decoded.description}</div>
      ) : (
          <EmptyDescription />
        )}
      <ExpiryTime expired={expired} decoded={decoded} tsDate={tsDate} />
      <div className={styles.destDetails}>
        <T id="ln.paymentsTab.destLabel" m="Destination" />
        <CopyableText id="copyable" className={styles.copyableText}>{decoded.destination}</CopyableText>
        <T id="ln.paymentsTab.hashLabel" m="Payment Hash" />
        <div>{decoded.paymentHash}</div>
      </div>
    </div>
  );

const BalanceHeader = () => {
  const { channelBalances } = usePaymentsTab();
  return (
    <div className={styles.balanceHeader}>
      <div className={`${styles.balanceTile} ${channelBalances.maxOutboundAmount === 0 ?
          styles.zeroFunds
          : styles.hasOutbound}
        `}>
        <div className={styles.balanceValue}>
          <Balance amount={channelBalances.maxOutboundAmount} />
        </div>
        <T
          id="ln.paymentsTab.balance.maxPayable"
          m="Max. Payable"
        />
      </div>
    </div>
  );
};

export default ({
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
  onSendValueChanged
}) => {
  const {
    isShowingDetails,
    selectedPaymentDetails,
    onToggleShowDetails
  } = usePaymentsTab();
  return (
    <>
      <Subtitle
        title={
          <T id="ln.paymentsTab.balanceHeader" m="Balance" />
        } />
      <BalanceHeader />

      <Subtitle title={
        <T id="ln.paymentsTab.sendPayment" m="Send Payment" />
      } />

      <div className={styles.lnSendPayment}>
        <div className="payreq">
          <T id="ln.paymentsTab.payReq" m="Payment Request" />
          <TextInput value={payRequest} onChange={onPayRequestChanged} />
        </div>
        {decodingError ? (
          <div className={styles.decodingError}>{"" + decodingError}</div>
        ) : null}
        {decodedPayRequest ? (
          <>
            <DecodedPayRequest
              decoded={decodedPayRequest}
              tsDate={tsDate}
              expired={expired}
              sendValue={sendValue}
              onSendValueChanged={onSendValueChanged}
            />
            <KeyBlueButton className="sendpayment" onClick={onSendPayment}>
              <T id="ln.paymentsTab.sendBtn" m="Send" />
            </KeyBlueButton>
          </>
        ) : null}
      </div>

      {Object.keys(outstandingPayments).length > 0 ? (
        <Subtitle title={
          <T id="ln.paymentsTab.outstanding" m="Ongoing Payments" />
        } />
      ) : null}

      <div className={styles.lnPaymentsList}>
        {Object.keys(outstandingPayments).map((ph) => (
          <OutstandingPayment
            payment={outstandingPayments[ph].decoded}
            key={`outstanding-${ph}`}
            tsDate={tsDate}
          />
        ))}
      </div>

      {failedPayments.length > 0 ? (
        <Subtitle title={
          <T id="ln.paymentsTag.failed" m="Failed Payments" />
        } />
      ) : null}

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

      {payments.length > 0 ? (<Subtitle title={
        <T id="ln.paymentsTab.latestPayments" m="Latest Payments" />
      } />) : null}

      <div className={styles.lnPaymentsList}>
        {payments.map((p) => (
          <VerticalAccordion
            key={`accordion-${p.paymentHash}`}
            arrowClassName={styles.verticalAccordionArrow}
            header={
              <Payment
                payment={p}
                tsDate={tsDate}
              />}
            onToggleAccordion={() => onToggleShowDetails(p.paymentHash)}
            show={
              p.paymentHash === selectedPaymentDetails
              && isShowingDetails}
          >
            <div className={styles.paymentDetails}>
              <span>PayReq</span>
              <div><b>{p.paymentRequest}</b></div>
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
                        <span><Balance amount={hop.fee} /></span>
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
