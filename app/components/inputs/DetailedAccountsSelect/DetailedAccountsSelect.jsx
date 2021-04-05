import AccountsSelect from "../AccountsSelect";
import styles from "./DetailedAccountsSelect.module.css";
import { Balance } from "shared";
import { useDetailedAccountsSelect } from "./hooks";
import { classNames } from "pi-ui";

// default account's number equals 2^31-1.
// source https://github.com/decred/dcrwallet/blob/master/wallet/udb/addressmanager.go#L43
const isImported = ({ value }) => value === Math.pow(2, 31) - 1;

const DetailedAccountsSelect = ({ selectClassName, ...props }) => {
  const { mixedAccount, changeAccount } = useDetailedAccountsSelect();
  const valueRenderer = (option) => {
    const isMixed = option.value === mixedAccount;
    const isChange = option.value === changeAccount;
    return (
      <div className={styles.value}>
        <div
          className={classNames(
            styles.name,
            styles.icon,
            isImported(option) && styles.imported,
            isMixed && styles.mixed,
            isChange && styles.unmixed
          )}>
          {option.name}
        </div>
        <div className={styles.spendable}>
          <span className={styles.balanceLabel}>Balance:</span>
          <Balance
            flat
            amount={option.spendable}
            classNameAmount={styles.balanceAmount}
            classNameUnit={styles.balanceUnit}
            classNameSecondary={styles.balanceSecondary}
          />
        </div>
      </div>
    );
  };
  const optionRenderer = (option) => (
    <div className={classNames(styles.value, styles.option)}>
      <div className={styles.name}>{option.name}</div>
      <div className={styles.spendable}>
        <Balance flat amount={option.spendable} />
      </div>
    </div>
  );

  // `detailedAccountSelect` and `selectWithBigFont` classNames are
  // temp solution to skinning from ReactSelectGlobal.css.
  // When react-select will be replaced by the `pi-ui` component,
  // this className can be deleted.
  return (
    <AccountsSelect
      className={classNames("detailedAccountSelect", "selectWithBigFont")}
      valueRenderer={valueRenderer}
      optionRenderer={optionRenderer}
      selectClassName={classNames(styles.select, selectClassName)}
      searchable={false}
      {...props}
    />
  );
};

DetailedAccountsSelect.propTypes = {
  accountsType: PropTypes.oneOf(["spending", "visible"]),
  className: PropTypes.string,
  showAccountsButton: PropTypes.bool,
  getAddressForSelected: PropTypes.bool
};

export default DetailedAccountsSelect;
