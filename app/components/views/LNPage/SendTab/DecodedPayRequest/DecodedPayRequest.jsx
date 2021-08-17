import { FormattedMessage as T } from "react-intl";
import {
  Balance,
  TruncatedText,
  CopyToClipboard,
  FormattedRelative,
  DetailsTable
} from "shared";
import { DcrInput } from "inputs";
import { SmallButton } from "buttons";
import styles from "./DecodedPayRequest.module.css";
import { getDecodedPayRequestDetails } from "./helpers";

const DecodedPayRequest = ({
  decoded,
  expired,
  tsDate,
  sendValue,
  onSendValueChanged
}) => (
  <div className={styles.decodedPayreq}>
    <div className={styles.row}>
      <div className={styles.amountContainer}>
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
      <div className={styles.destinationContainer}>
        <label>
          <T id="ln.paymentsTab.destLabel" m="Destination" />
        </label>
        <div className={styles.destination}>
          <div className={styles.destinationText}>
            <TruncatedText text={decoded.destination} max={10} />
          </div>
          <CopyToClipboard
            textToCopy={decoded.destination}
            ButtonComponent={SmallButton}
          />
        </div>
      </div>
      <div className={styles.expiryContainer}>
        <label>
          <T id="ln.paymentsTab.expiryLabel" m="Expiry" />
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
    <div className={styles.dataGrid}>
      <label>
        <T id="ln.paymentsTab.descLabel" m="Description" />:
      </label>
      {decoded.description ? (
        <div>{decoded.description}</div>
      ) : (
        <T id="ln.paymentsTab.emptyDescr" m="(empty description)" />
      )}
      <label>
        <T id="ln.paymentsTab.paymentHashLabel" m="Payment Hash" />:
      </label>
      {decoded.paymentHash}
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
