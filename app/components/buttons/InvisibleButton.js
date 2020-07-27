import { classNames } from "pi-ui";

const InvisibleButton = ({
  className,
  style,
  block,
  type,
  disabled,
  onClick,
  children
}) => (
  <div
    className={classNames("invisible-button", className)}
    style={{ ...style, display: block ? "block" : undefined }}
    onClick={() => (!disabled && onClick ? onClick() : undefined)}
    {...{ type, disabled }}>
    {children}
  </div>
);

export default InvisibleButton;
