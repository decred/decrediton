import Select from "react-select";
import { useAccountsSelect } from "./hooks";
import { Balance, LinkToAccounts } from "shared";
import styles from "./AccountsSelect.module.css";
import { classNames } from "pi-ui";

const AccountsSelect = ({
  accountsType,
  className,
  showAccountsButton,
  disabled,
  hideSpendable,
  filterAccounts,
  account: accountProp,
  onChange,
  onKeyDown
}) => {
  const { account, accounts, placeholder } = useAccountsSelect({
    accountProp,
    accountsType,
    filterAccounts
  });

  const selectKeyDown = (e) => {
    switch (e.keyCode) {
      case 8:
      case 46:
        e.preventDefault();
        break;
    }
    onKeyDown?.(e);
  };

  const valueRenderer = (option) => (
    <div className={styles.value}>
      <div className={styles.name}>{option.name}</div>
      {!hideSpendable && (
        <div className={styles.spendable}>
          <Balance flat amount={option.spendable} />
        </div>
      )}
    </div>
  );

  return (
    <div
      className={classNames(styles.isRow, className)}
      data-testid="accountsSelect">
      <Select
        disabled={disabled}
        clearable={false}
        style={{ zIndex: "9" }}
        placeholder={placeholder}
        multi={false}
        value={account}
        valueKey="value"
        labelKey="label"
        options={accounts}
        valueRenderer={valueRenderer}
        optionRenderer={valueRenderer}
        onChange={(acc) => onChange?.(acc)}
        className={styles.select}
        onInputKeyDown={selectKeyDown}
      />
      {showAccountsButton && <LinkToAccounts />}
    </div>
  );
};

AccountsSelect.propTypes = {
  accountsType: PropTypes.oneOf(["spending", "visible"]),
  className: PropTypes.string,
  showAccountsButton: PropTypes.bool,
  getAddressForSelected: PropTypes.bool
};

export default AccountsSelect;
