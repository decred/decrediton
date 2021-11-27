import { Balance } from "shared";
import { TextHighlighted } from "pi-ui";
import styles from "./BalanceDisplay.module.css";

export const BalanceDisplay = ({ amount }) => {
  return (
    <TextHighlighted className={styles.textHighlighted} truncate={false}>
      <Balance
        flat
        amount={amount}
        classNameWrapper={styles.balance}
        classNameUnit={styles.balanceUnit}
      />
    </TextHighlighted>
  );
};

export default BalanceDisplay;
