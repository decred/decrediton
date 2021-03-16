import styles from "./TextToggle.module.css";
import { classNames } from "pi-ui";

const Toggle = ({ leftText, rightText, activeButton, onClick }) => (
  <div className={classNames(styles.textToggle, styles.isRow)}>
    <div
      className={classNames(
        styles.textToggleButtonLeft,
        activeButton === "left" && styles.textToggleButtonActive
      )}
      onClick={activeButton == "right" ? () => onClick("left") : null}>
      {leftText}
    </div>
    <div
      className={classNames(
        styles.textToggleButtonRight,
        activeButton === "right" && styles.textToggleButtonActive
      )}
      onClick={activeButton == "left" ? () => onClick("right") : null}>
      {rightText}
    </div>
  </div>
);

export default Toggle;
