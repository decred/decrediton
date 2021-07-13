import styles from "./TextToggle.module.css";
import { classNames } from "pi-ui";

const Toggle = ({
  leftText,
  rightText,
  activeButton,
  onClick,
  className,
  childClassName
}) => (
  <div className={classNames(styles.textToggle, styles.isRow, className)}>
    <div
      className={classNames(
        styles.textToggleButtonLeft,
        childClassName,
        activeButton === "left" && styles.textToggleButtonActive
      )}
      onClick={activeButton == "right" ? () => onClick("left") : null}>
      {leftText}
    </div>
    <div
      className={classNames(
        styles.textToggleButtonRight,
        childClassName,
        activeButton === "right" && styles.textToggleButtonActive
      )}
      onClick={activeButton == "left" ? () => onClick("right") : null}>
      {rightText}
    </div>
  </div>
);

export default Toggle;
