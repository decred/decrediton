import "style/StakePool.less";
import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";

// enabled shows the switch as on or off
// disabled unable to trigger the onClick method
const AutoBuyerSwitch = ({ enabled, onClick, disabled }) => (
  <Tooltip
    text={
      enabled ? (
        <T id="autobuyer.enabled" m="Turn off auto buyer" />
      ) : (
        <T id="autobuyer.disabled" m="Turn on auto buyer" />
      )
    }>
    <div className="autobuyer-switch">
      <div
        className={
          enabled ? "autobuyer-switch-enabled" : "autobuyer-switch-disabled"
        }
        onClick={!disabled ? onClick : undefined}>
        <div
          className={
            enabled
              ? "autobuyer-switch-knob-enabled"
              : "autobuyer-switch-knob-disabled"
          }></div>
      </div>
    </div>
  </Tooltip>
);

export default AutoBuyerSwitch;
