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
    getRunningIndicator
  }) => (
    <div className={expandSideBar ? style.logo : style.reducedLogo}>
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
      <button
        aria-label="Logo"
        onClick={!expandSideBar ? onExpandSideBar : null}
        className={
          !expandSideBar ? style.hamburger : isTestNet ? TESTNET : MAINNET
        }
      />
      {getRunningIndicator && (
        <Tooltip
          text={
            <T
              id="sidebar.mixer.running"
              m="The mixer is running. Go to Privacy view for more information"
            />
          }>
          {/* XXX change this as this global class is gone*/}
          <div className="rescan-button spin" />
        </Tooltip>
      )}
      {expandSideBar && (
        <button
          aria-label="Reduce sidebar"
          className={style.reducedArrow}
          onClick={onReduceSideBar}
        />
      )}
    </div>
  )
);

export default Logo;
