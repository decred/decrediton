import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import { CopyableText } from "pi-ui";
import { DcrInput } from "inputs";
import styles from "./DecodedPayRequest.module.css";
import ExpiryTime from "./ExpiryTime/ExpiryTime";
import EmptyDescription from "./EmptyDescription/EmptyDescription";

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
      <DcrInput
        id="sendValueInput"
        amount={sendValue}
        onChangeAmount={onSendValueChanged}
      />
    )}
    {decoded.description ? (
      <div className={styles.description}>{decoded.description}</div>
    ) : (
      <EmptyDescription />
    )}
    <ExpiryTime expired={expired} decoded={decoded} tsDate={tsDate} />
    <div className={styles.destDetails}>
      <T id="ln.paymentsTab.destLabel" m="Destination" />
      <CopyableText id="copyable" className={styles.copyableText}>
        {decoded.destination}
      </CopyableText>
      <T id="ln.paymentsTab.hashLabel" m="Payment Hash" />
      <div>{decoded.paymentHash}</div>
    </div>
  </div>
);

export default DecodedPayRequest;
