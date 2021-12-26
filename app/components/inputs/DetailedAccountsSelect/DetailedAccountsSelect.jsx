import AccountsSelect from "../AccountsSelect";
import styles from "./DetailedAccountsSelect.module.css";
import { Balance } from "shared";
import { useDetailedAccountsSelect } from "./hooks";
import { classNames } from "pi-ui";
import { components } from "react-select";

// default account's number equals 2^31-1.
// source https://github.com/decred/dcrwallet/blob/master/wallet/udb/addressmanager.go#L43
const isImported = ({ value }) => value === Math.pow(2, 31) - 1;

const DetailedAccountsSelect = (props) => {
  const { mixedAccount, changeAccount } = useDetailedAccountsSelect();
  const SingleValue = (props) => {
    const isMixed = props.data.value === mixedAccount;
    const isChange = props.data.value === changeAccount;
    return (
      <components.SingleValue {...props}>
        <div className={styles.value}>
          <div
            className={classNames(
              styles.name,
              styles.icon,
              isImported(props.data) && styles.imported,
              isMixed && styles.mixed,
              isChange && styles.unmixed
            )}>
            {props.data.name}
          </div>
          <div className={styles.spendable}>
            <span className={styles.balanceLabel}>Balance:</span>
            <Balance
              flat
              amount={props.data.spendable}
              classNameAmount={styles.balanceAmount}
              classNameUnit={styles.balanceUnit}
              classNameSecondary={styles.balanceSecondary}
            />
          </div>
        </div>
      </components.SingleValue>
    );
  };

  const Option = (props) => {
    return (
      <components.Option {...props}>
        <div className={classNames(styles.value, styles.option)}>
          <div className={styles.name}>{props.data.name}</div>
          <div className={styles.spendable}>
            <Balance flat amount={props.data.spendable} />
          </div>
        </div>
      </components.Option>
    );
  };

  const customStyles = {
    control: () => ({
      padding: 0,
      border: "none"
    }),
    indicatorsContainer: () => ({
      alignItems: "flex-start",
      marginTop: "0.3rem"
    })
  };

  return (
    <AccountsSelect
      selectWithBigFont
      className={styles.detailedAccountSelect}
      selectClassName={styles.select}
      customStyles={customStyles}
      customComponents={{ SingleValue, Option }}
      {...props}
    />
  );
};

export default DetailedAccountsSelect;
