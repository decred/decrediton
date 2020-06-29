import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";
import { TESTNET, MAINNET } from "constants";
import style from "./Logo.module.css";

const Logo = React.memo(
  ({
    isTestNet,
    expandSideBar,
    onReduceSideBar,
    onExpandSideBar,
    isWatchingOnly,
    accountMixerRunning
  }) => (
    <div
      className={expandSideBar ? style.logo : style.reducedLogo}
      onClick={!expandSideBar ? onExpandSideBar : null}>
      {isWatchingOnly && (
        <Tooltip
          text={
            <T
              id="sidebar.isWatchingOnlyTooltip"
              m="This is a watch-only wallet with limited functionality."
            />
          }>
          <div className={style.watchOnlyIcon} />
        </Tooltip>
      )}
      <div
        className={
          !expandSideBar ? style.hamburger : isTestNet ? TESTNET : MAINNET
        }
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
          className={style.reducedArrow}
          onClick={expandSideBar ? onReduceSideBar : null}></div>
      )}
    </div>
  )
);

export default Logo;
