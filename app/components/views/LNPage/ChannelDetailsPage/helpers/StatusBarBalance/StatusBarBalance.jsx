import { Balance } from "shared";
import styles from "./StatusBarBalance.module.css";

const StatusBarBalance = ({ amount }) => (
  <Balance
    amount={amount}
    flat
    detailsValueColumn={styles.statusBarBalance}
    classNameUnit={styles.statusBarDetailsUnit}
  />
);
export default StatusBarBalance;
