import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";

const Logo = ({ isTestNet, expandSideBar, onReduceSideBar, onExpandSideBar, isWatchingOnly, }) => (
  <div className={expandSideBar ? "sidebar-logo" : "reduced-sidebar-logo"} onClick={!expandSideBar ? onExpandSideBar : null}>
    {
      isWatchingOnly &&
      <Tooltip text={<T id="sidebar.isWatchingOnlyTooltip" m="This is a watch-only wallet with limited functionality." /> }>
        <div className="sidebar-watch-only-icon"/>
      </Tooltip>
    }
    <div className={!expandSideBar ? "hamburger" : isTestNet ? "testnet" : "mainnet"} />
    {expandSideBar &&
      <div className="sidebar-reduce-arrow" onClick={expandSideBar ? onReduceSideBar : null}>
      </div>
    }
  </div>
);

export default Logo;
