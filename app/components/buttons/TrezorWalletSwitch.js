import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/EyeFilterMenu.less";
import "style/StakePool.less";

const TrezorWalletSwitch = ({ enabled, onClick, className }) => (
  <div className={className ? className : ""}>
    <Tooltip text={enabled ? <T id="createWallet.restore.trezor.enabled" m="Enabled" /> : <T id="createWallet.restore.trezor.disabled" m="Disabled" />}>
      <div className="autobuyer-switch">
        <div className={enabled ? "autobuyer-switch-enabled" : "autobuyer-switch-disabled"} onClick={onClick}>
          <div className={enabled ? "autobuyer-switch-knob-enabled" : "autobuyer-switch-knob-disabled"}/>
        </div>
      </div>
    </Tooltip>
  </div>
);

export default TrezorWalletSwitch;
