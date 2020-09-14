import { Subtitle } from "shared";
import { CopyableText } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import styles from "./Signature.module.css";

const Signature = ({ signature }) => (
  <div>
    <div className={styles.subtitle}>
      <Subtitle
        title={<T id="security.signature" m="Signature" />}
      />
    </div>
    <div className={styles.copyableTextContainer}>
      <CopyableText
        className={styles.copyableText}
        id="copyable"
        hoverText="Copy signature to clipboard"
        truncate>
        {signature}
      </CopyableText>
    </div>
  </div>
);

export default Signature;
