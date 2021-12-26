import { useAccountsSelect } from "./hooks";
import { Balance } from "shared";
import styles from "./AccountsSelect.module.css";
import { classNames } from "pi-ui";
import { Select } from "inputs";
import LinkToAccounts from "./LinkToAccounts";
import { components } from "react-select";

const AccountsSelect = ({
  accountsType,
  className,
  selectClassName,
  showAccountsButton,
  hideSpendable,
  filterAccounts,
  account: accountProp,
  customStyles,
  customComponents,
  onChange,
  selectWithBigFont,
  ...props
}) => {
  const { account, accounts, placeholder } = useAccountsSelect({
    accountProp,
    accountsType,
    filterAccounts,
    onChange
  });

  const SingleValue = (props) => {
    return (
      <components.SingleValue {...props}>
        <div
          className={classNames(
            styles.value,
            selectWithBigFont && styles.selectWithBigFont
          )}>
          <div className={styles.name}>{props.data.name}</div>
          {!hideSpendable && (
            <div className={styles.spendable}>
              <Balance flat amount={props.data.spendable} />
            </div>
          )}
        </div>
      </components.SingleValue>
    );
  };

  const Option = (props) => {
    return (
      <components.Option {...props}>
        <div className={styles.label}>
          <div className={styles.name}>{props.data.name}</div>
          {!hideSpendable && (
            <div className={styles.spendable}>
              <Balance flat amount={props.data.spendable} />
            </div>
          )}
        </div>
      </components.Option>
    );
  };

  return (
    <div
      className={classNames(styles.container, className)}
      data-testid="accountsSelect">
      <Select
        placeholder={placeholder}
        value={account}
        options={accounts}
        customComponents={{ SingleValue, Option, ...customComponents }}
        className={selectClassName}
        styles={customStyles}
        selectWithBigFont={selectWithBigFont}
        onChange={(acc) => onChange?.(acc)}
        {...props}
      />
      {showAccountsButton && <LinkToAccounts />}
    </div>
  );
};

AccountsSelect.propTypes = {
  accountsType: PropTypes.oneOf(["spending", "visible"]),
  className: PropTypes.string,
  showAccountsButton: PropTypes.bool
};

export default AccountsSelect;
