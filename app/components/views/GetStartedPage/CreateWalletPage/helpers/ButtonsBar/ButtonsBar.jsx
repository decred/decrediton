import { classNames } from "pi-ui";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { BackBtnMsg } from "../../../messages";
import styles from "./ButtonsBar.module.css";

const ButtonsBar = ({
  disabled,
  loading,
  onClick,
  onBackClick,
  message,
  backMessage,
  className,
  primaryButtonClassName,
  backButtonClassName
}) => (
  <div className={classNames(styles.buttonsBar, className)}>
    <KeyBlueButton
      className={classNames(styles.primaryButton, primaryButtonClassName)}
      disabled={disabled}
      loading={loading}
      onClick={onClick}>
      {message}
    </KeyBlueButton>
    <InvisibleButton
      className={classNames(styles.backButton, backButtonClassName)}
      onClick={onBackClick}>
      {backMessage || <BackBtnMsg />}
    </InvisibleButton>
  </div>
);

export default ButtonsBar;
