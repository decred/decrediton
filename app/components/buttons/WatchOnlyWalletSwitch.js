import EventListener from "react-event-listener";
import { Tooltip } from "shared";
import { InvisibleButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import "style/EyeFilterMenu.less";
import "style/StakePool.less";

const WatchOnlyWalletSwitch = ({ enabled, onClick, className }) => (
  <div className={className ? className : ""}>
    <Tooltip text={enabled ? <T id="autobuyer.enabled" m="Watch only Wallet" /> : <T id="autobuyer.disabled" m="Not Watch only Wallet" />}>
      <EventListener target="document">
        <div className="teste">
          <div className="eye-filter-menu-button">
            <InvisibleButton
              className={ enabled ? "eye-filter-menu-button-icon" : "eye-filter-menu-button-icon-disabled" }
              onClick={onClick}
            />
          </div>
        </div>
      </EventListener>
    </Tooltip>
  </div>
);

export default WatchOnlyWalletSwitch;
