import styles from "./ToggleSwitch.module.css";
import { Spinner, Tooltip, Toggle, classNames } from "pi-ui";

// enabled shows the switch as on or off.
// disabled unable to trigger the onClick method.
// enabledText and notEnabledText the tooltop contents when the switch is on/off.
const ToggleSwitch = ({
  className,
  tooltipClassName,
  enabled,
  onClick,
  disabled,
  enabledText,
  disabledText,
  notEnabledText,
  loading
}) => (
  <>
    {loading ? (
      <div className={styles.spinner}>
        <Spinner invert />
      </div>
    ) : (
      <Tooltip
        contentClassName={classNames(styles.tooltip, tooltipClassName)}
        content={
          disabled ? disabledText : enabled ? enabledText : notEnabledText
        }>
        <Toggle
          {...{
            onToggle: onClick,
            toggled: !!enabled,
            disabled: !!disabled,
            className
          }}
        />
      </Tooltip>
    )}
  </>
);

export default ToggleSwitch;
