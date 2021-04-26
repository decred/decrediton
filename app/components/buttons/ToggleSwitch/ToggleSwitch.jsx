import styles from "./ToggleSwitch.module.css";
import { Tooltip, classNames } from "pi-ui";

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
  notEnabledText
}) => (
  <Tooltip
    contentClassName={classNames(styles.tooltip, tooltipClassName)}
    content={disabled ? disabledText : enabled ? enabledText : notEnabledText}>
    <div className={classNames(styles.toggleSwitch, className)}>
      <div
        data-testid="toggleSwitch"
        className={enabled ? styles.enabled : styles.disabled}
        onClick={!disabled ? onClick : undefined}>
        <div
          className={enabled ? styles.knobEnabled : styles.knobDisabled}></div>
      </div>
    </div>
  </Tooltip>
);

export default ToggleSwitch;
