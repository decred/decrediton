import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import { TESTNET, MAINNET } from "constants";

const Logo = ({
  isTestNet,
  expandSideBar,
  onReduceSideBar,
  onExpandSideBar,
  isWatchingOnly,
  accountMixerRunning
}) => (
  <div
    className={expandSideBar ? "sidebar-logo" : "reduced-sidebar-logo"}
    onClick={!expandSideBar ? onExpandSideBar : null}>
    {isWatchingOnly && (
      <Tooltip
        text={
          <T
            id="sidebar.isWatchingOnlyTooltip"
            m="This is a watch-only wallet with limited functionality."
          />
        }>
        <div className="sidebar-watch-only-icon" />
      </Tooltip>
    )}
    <div
      className={!expandSideBar ? "hamburger" : isTestNet ? TESTNET : MAINNET}
    />
    {accountMixerRunning && (
      <Tooltip
        text={
          <T
            id="sidebar.mixer.running"
            m="The mixer is running. Go to Privacy view for more information"
          />
        }>
        <div className="rescan-button spin" />
      </Tooltip>
    )}
    {expandSideBar && (
      <div
        className="sidebar-reduce-arrow"
        onClick={expandSideBar ? onReduceSideBar : null}></div>
    )}
  </div>
);

export default Logo;
