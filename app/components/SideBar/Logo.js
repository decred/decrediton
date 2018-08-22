import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";

const Logo = ({ isTestNet, expandSideBar, onReduceSideBar, onExpandSideBar, isWatchOnly, }) => (
  <div className={expandSideBar ? "sidebar-logo" : "reduced-sidebar-logo"} onClick={!expandSideBar ? onExpandSideBar : null}>
    {
      isWatchOnly &&
      <Tooltip text={<T id="createWallet.goBack" m="This is a watch-only wallet with limited functionality." /> }>
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
