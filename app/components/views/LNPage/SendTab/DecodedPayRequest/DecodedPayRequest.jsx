import { FormattedMessage as T } from "react-intl";
import { Balance, TruncatedText } from "shared";
import { DcrInput } from "inputs";
import styles from "./DecodedPayRequest.module.css";

const DecodedPayRequest = ({ decoded, sendValue, onSendValueChanged }) => (
  <div className={styles.decodedPayreq}>
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
        <TruncatedText text={decoded.destination} max={10} />
      </div>
    </div>
  </div>
);

export default DecodedPayRequest;
