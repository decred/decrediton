import { Tooltip } from "pi-ui";
import { Link } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import styles from "./LinkToAccounts.module.css";

const LinkToAccounts = () => (
  <Tooltip content={<T id="accountsButton.tip" m="Accounts" />}>
    <Link to="/accounts" className={styles.icon} />
  </Tooltip>
);

export default LinkToAccounts;
