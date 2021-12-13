import { FormattedMessage as T } from "react-intl";
import {
  Balance,
  TruncatedText,
  FormattedRelative,
  DetailsTable
} from "shared";
import { CopyToClipboardButton } from "buttons";
import { DcrInput } from "inputs";
import styles from "./DecodedPayRequest.module.css";
import { getDecodedPayRequestDetails } from "./helpers";
import { classNames } from "pi-ui";

const DecodedPayRequest = ({
  decoded,
  expired,
  tsDate,
  sendValue,
  onSendValueChanged
}) => (
  <div className={styles.decodedPayreq}>
    <div className={styles.row}>
      <div className={styles.propContainer}>
        <label>
          <T id="ln.paymentsTab.amountLabel" m="Amount" />
        </label>
        {decoded.numAtoms ? (
          <Balance amount={decoded.numAtoms} classNameWrapper={styles.amount} />
        ) : (
          <DcrInput
            id="sendValueInput"
            amount={sendValue}
            onChangeAmount={onSendValueChanged}
          />
        )}
      </div>
      <div className={styles.arrow} />
      <div className={styles.propContainer}>
        <label>
          <T id="ln.paymentsTab.destLabel" m="Destination" />
        </label>
        <div className={styles.destination}>
          <div className={styles.destinationText}>
            <TruncatedText text={decoded.destination} max={10} />
          </div>
          <CopyToClipboardButton textToCopy={decoded.destination} />
        </div>
      </div>
      <div className={classNames(styles.propContainer, styles.expiryContainer)}>
        <label>
          <T id="ln.paymentsTab.expiryLabel" m="Expiration Time" />
        </label>
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
    </div>
    <div
      className={classNames(styles.propContainer, styles.descriptionContainer)}>
      <label>
        <T id="ln.paymentsTab.descLabel" m="Description" />
      </label>
      {decoded.description ? (
        <div>{decoded.description}</div>
      ) : (
        <T id="ln.paymentsTab.emptyDescr" m="(empty description)" />
      )}
    </div>
    <div
      className={classNames(styles.propContainer, styles.paymentHashContainer)}>
      <label>
        <T id="ln.paymentsTab.paymentHashLabel" m="Payment Hash" />
      </label>
      <div className={styles.paymentHashWrapper}>
        <span className={styles.paymentHash}>{decoded.paymentHash}</span>
        <CopyToClipboardButton textToCopy={decoded.paymentHash} />
      </div>
    </div>

    <DetailsTable
      data={getDecodedPayRequestDetails(decoded, tsDate)}
      className={styles.details}
      title={<T id="ln.paymentsTab.decodedPayreq.details" m="Details" />}
      expandable
    />
  </div>
);

export default DecodedPayRequest;
