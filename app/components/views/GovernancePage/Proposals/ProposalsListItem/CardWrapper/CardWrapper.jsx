import { classNames } from "pi-ui";
import styles from "./CardWrapper.module.css";

const CardWrapper = ({ onClick, className, children }) => (
  <div onClick={onClick} className={classNames(styles.cardWrapper, className)}>
    {children}
    <div className={classNames(styles.continueButton, "flex-centralize")}>
      <div className={styles.continueArrow}></div>
    </div>
  </div>
);

export default CardWrapper;
