import { classNames } from "pi-ui";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { BackBtnMsg } from "../../../messages";
import styles from "./ButtonsBar.module.css";

const ButtonsBar = ({ disabled, loading, onClick, onBackClick, message }) => (
  <div className={classNames(styles.buttonsBar, "margin-top-m")}>
    <KeyBlueButton
      className={styles.primaryButton}
      disabled={disabled}
      loading={loading}
      onClick={onClick}>
      {message}
    </KeyBlueButton>
    <InvisibleButton className={styles.backButton} onClick={onBackClick}>
      <BackBtnMsg />
    </InvisibleButton>
  </div>
);

export default ButtonsBar;
