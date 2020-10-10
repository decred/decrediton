import { Tooltip } from "shared";
// XXX the following .less file is dead, adjust accordingly
// import "style/EyeFilterMenu.less";
import "style/StakePool.less";

const RestoreWalletSwitch = ({ enabled, onClick, className, text }) => (
  <div className={className ? className : ""}>
    <Tooltip
      text={text}>
      <div className="autobuyer-switch">
        <div
          className={
            enabled ? "autobuyer-switch-enabled" : "autobuyer-switch-disabled"
          }
          onClick={onClick}>
          <div
            className={
              enabled
                ? "autobuyer-switch-knob-enabled"
                : "autobuyer-switch-knob-disabled"
            }
          />
        </div>
      </div>
    </Tooltip>
  </div>
);

export default RestoreWalletSwitch;
