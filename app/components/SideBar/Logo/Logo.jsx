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
              m="One or more of the following decrediton's features running in the background: Privacy Mixer, Ticket Auto Buyer, Purchase Ticket Attempt"
            />
          }>
          <div className={style.mixerOn} />
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
