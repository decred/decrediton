import style from "./ToggleSwitch.module.css";
import { Tooltip } from "shared";
import { classNames } from "pi-ui";

// enabled shows the switch as on or off.
// disabled unable to trigger the onClick method.
// enabledText and notEnabledText the tooltop contents when the switch is on/off.
const ToggleSwitch = ({ enabled, onClick, disabled, enabledText, notEnabledText }) => (
  <Tooltip
    text={ enabled ? enabledText : notEnabledText }>
    <div className={classNames(style.toggleSwitch)}>
      <div
        className={classNames(
          enabled
          ? style.enabled
          : style.disabled
        )}
        onClick={!disabled ? onClick : undefined}>
        <div
          className={classNames(
            enabled
              ? style.knobEnabled
              : style.knobDisabled
          )}></div>
      </div>
    </div>
  </Tooltip>
);

export default ToggleSwitch;
