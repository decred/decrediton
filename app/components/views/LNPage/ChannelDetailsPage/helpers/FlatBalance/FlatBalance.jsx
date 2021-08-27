import { Balance } from "shared";
import styles from "./FlatBalance.module.css";

const FlatBalance = ({ amount }) => (
  <Balance
    amount={amount}
    flat
    classNameSecondary={styles.balanceSecondary}
    classNameUnit={styles.balanceUnit}
  />
);
export default FlatBalance;
