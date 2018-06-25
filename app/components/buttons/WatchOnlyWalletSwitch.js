import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/EyeFilterMenu.less";
import "style/StakePool.less";

const WatchOnlyWalletSwitch = ({ enabled, onClick, className }) => (
  <div className={className ? className : ""}>
    <Tooltip text={enabled ? <T id="watchOnly.enabled" m="Watch Only" /> : <T id="watchOnly.disabled" m="Normal" />}>
      <div className="autobuyer-switch">
        <div className={enabled ? "autobuyer-switch-enabled" : "autobuyer-switch-disabled"} onClick={onClick}>
          <div className={enabled ? "autobuyer-switch-knob-enabled" : "autobuyer-switch-knob-disabled"}/>
        </div>
      </div>
    </Tooltip>
  </div>
);

export default WatchOnlyWalletSwitch;
