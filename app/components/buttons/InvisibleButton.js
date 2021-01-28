import { classNames } from "pi-ui";

const InvisibleButton = ({
  className,
  style,
  block,
  type,
  disabled,
  onClick,
  children,
  ariaLabel
}) => (
  <div
    className={classNames("invisible-button", className)}
    role="button"
    aria-label={ariaLabel}
    style={{ ...style, display: block ? "block" : undefined }}
    onClick={() => (!disabled && onClick ? onClick() : undefined)}
    {...{ type, disabled }}>
    {children}
  </div>
);

export default InvisibleButton;
