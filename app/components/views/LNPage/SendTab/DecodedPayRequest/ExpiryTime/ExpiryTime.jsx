import { FormattedMessage as T } from "react-intl";
import { FormattedRelative } from "shared";
import styles from "./ExpiryTime.module.css";

const ExpiryTime = ({ expired, decoded, tsDate }) => (
  <div className={styles.expiry}>
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

export default ExpiryTime;
