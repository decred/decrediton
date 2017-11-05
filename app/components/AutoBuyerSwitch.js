import "style/StakePool.less";
import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";

const AutoBuyerSwitch = ({ enabled, onClick }) => (
  <Tooltip text={enabled ? <T id="autobuyer.enabled" m="Turn off auto buyer" /> : <T id="autobuyer.disabled" m="Turn on auto buyer" />}>
    <div className="autobuyer-switch">
      <div className={enabled ? "autobuyer-switch-enabled" : "autobuyer-switch-disabled"} onClick={onClick}>
        <div className={enabled ? "autobuyer-switch-knob-enabled" : "autobuyer-switch-knob-disabled"}></div>
      </div>
    </div>
  </Tooltip>
);

export default AutoBuyerSwitch;
