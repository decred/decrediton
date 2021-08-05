import { useState, Fragment } from "react";
import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import styles from "./InvoiceDetails.module.css";

const InvoiceDetails = ({ invoice, tsDate, className }) => {
  const [showDetails, setShowDetails] = useState(false);
  const toggleDetailsVisibility = () => setShowDetails((b) => !b);

  return (
    <div className={className}>
      <div
        onClick={toggleDetailsVisibility}
        className={classNames(
          styles.header,
          showDetails && styles.active
        )}>
        <T id="ln.invoicesModal.details" m="Details" />
        <div className={styles.arrow} />
      </div>
      {showDetails && (
        <div className={styles.grid}>
          <label>
            <T id="ln.invoicesModal.hash" m="Hash" />
          </label>
          <div className={styles.value}>{invoice?.rHash}</div>
          <label>
            <T id="ln.invoicesModal.desc" m="Description" />
          </label>
          <div className={styles.value}>{invoice?.memo}</div>
          {invoice?.htlcsList?.map((htlc, index) => (
            <Fragment key={htlc.htlcIndex}>
              <label>
                <T id="ln.invoicesModal.htlc" m="HTLC" /> {index}
              </label>
              <div className={styles.secondaryGrid}>
                <label>
                  <T id="ln.invoicesModal.htlc.state" m="State" />
                </label>
                <div className={styles.value}>{htlc.state}</div>
                <label>
                  <T id="ln.invoicesModal.htlc.chanId" m="Channel id" />
                </label>
                <div className={styles.value}>{htlc.chanId}</div>
                <label>
                  <T
                    id="ln.invoicesModal.htlc.acceptHeight"
                    m="Accept Height"
                  />
                </label>
                <div className={styles.value}>{htlc.acceptHeight}</div>
                <label>
                  <T
                    id="ln.invoicesModal.htlc.acceptTimeLabel"
                    m="Accept Time"
                  />
                </label>
                <div className={styles.value}>
                  <T
                    id="ln.invoicesModal.htlc.acceptTime"
                    m="{acceptTime, date, medium} {acceptTime, time, short}"
                    values={{ acceptTime: tsDate(htlc.acceptTime) }}
                  />
                </div>
                <label>
                  <T
                    id="ln.invoicesModal.htlc.expiryHeight"
                    m="Expiry Height"
                  />
                </label>
                <div className={styles.value}>{htlc.expiryHeight}</div>
                <label>
                  <T
                    id="ln.invoicesModal.htlc.resolveTimeLabel"
                    m="Resolve Time"
                  />
                </label>
                <div className={styles.value}>
                  <T
                    id="ln.invoicesModal.htlc.resolveTime"
                    m="{resolveTime, date, medium} {resolveTime, time, short}"
                    values={{ resolveTime: tsDate(htlc.resolveTime) }}
                  />
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;
