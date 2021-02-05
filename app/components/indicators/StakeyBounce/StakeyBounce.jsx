import styles from "./StakeyBounce.module.css";
import { classNames } from "pi-ui";

const StakeyBounce = ({ center }) => (
  <div
    className={classNames(styles.stakeyBounce, center && styles.center)}
    data-testid="stakey-bounce"
  />
);

export default StakeyBounce;
