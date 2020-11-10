import style from "./ToggleSwitch.module.css";
import { Tooltip } from "shared";

// enabled shows the switch as on or off.
// disabled unable to trigger the onClick method.
// enabledText and notEnabledText the tooltop contents when the switch is on/off.
const ToggleSwitch = ({ enabled, onClick, disabled, enabledText, notEnabledText }) => (
  <Tooltip
    text={ enabled ? enabledText : notEnabledText }>
    <div className={style.toggleSwitch}>
      <div
        className={ enabled ? style.enabled : style.disabled }
        onClick={!disabled ? onClick : undefined}>
        <div className={ enabled ? style.knobEnabled : style.knobDisabled }></div>
      </div>
    </div>
  </Tooltip>
);

export default ToggleSwitch;
