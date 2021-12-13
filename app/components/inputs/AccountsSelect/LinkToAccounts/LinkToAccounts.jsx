import { Tooltip, ButtonIcon } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import styles from "./LinkToAccounts.module.css";
import { useLinkToAccounts } from "./hooks";

const LinkToAccounts = () => {
  const { goToAccounts, iconColor } = useLinkToAccounts();
  return (
    <Tooltip content={<T id="accountsButton.tip" m="Accounts" />}>
      <ButtonIcon
        type="accounts"
        iconColor={iconColor}
        className={styles.icon}
        onClick={goToAccounts}
      />
    </Tooltip>
  );
};

export default LinkToAccounts;
