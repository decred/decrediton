import { FormattedMessage as T } from "react-intl";
import styles from "./SubtitleWalletName.module.css";

const SubtitleWalletName = React.memo(({ walletName }) => (
  <span>
    <span className={styles.walletName}>{walletName}</span>
    <T id="accounts.subtitle" m="Accounts" />
  </span>
));

export default SubtitleWalletName;
