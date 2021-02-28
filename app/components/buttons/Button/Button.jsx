import { SimpleLoading } from "indicators";
import styles from "./Button.module.css";
import { classNames } from "pi-ui";

const Button = ({
  className,
  style,
  disabled,
  type,
  block,
  hidden,
  loading,
  onClick,
  ariaLabel,
  children
}) => {
  const buttonStyle = { ...style };
  if (!disabled && block) {
    buttonStyle.display = "block";
  }

  return (
    <button
      className={classNames(styles.button, className)}
      style={buttonStyle}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={(e) => {
        !disabled && onClick?.(e);
      }}
      hidden={hidden}>
      {loading ? <SimpleLoading {...{ disabled: disabled }} /> : children}
    </button>
  );
};

export default Button;
