import "style/ToggleSwitch.less";
import { Tooltip } from "shared";

// enabled shows the switch as on or off.
// disabled unable to trigger the onClick method.
// enabledText and notEnabledText the tooltop contents when the switch is on/off.
const ToggleSwitch = ({ enabled, onClick, disabled, enabledText, notEnabledText }) => (
  <Tooltip
    text={ enabled ? enabledText : notEnabledText }>
    <div className="toggle-switch">
      <div
        className={
          enabled ? "toggle-switch-enabled" : "toggle-switch-disabled"
        }
        onClick={!disabled ? onClick : undefined}>
        <div
          className={
            enabled
              ? "toggle-switch-knob-enabled"
              : "toggle-switch-knob-disabled"
          }></div>
      </div>
    </div>
  </Tooltip>
);

export default ToggleSwitch;
