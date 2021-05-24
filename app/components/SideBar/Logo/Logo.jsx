import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import { TESTNET, MAINNET } from "constants";
import styles from "./Logo.module.css";

const Logo = React.memo(
  ({
    isTestNet,
    expandSideBar,
    onReduceSideBar,
    onExpandSideBar,
    isWatchingOnly
  }) => (
    <div className={expandSideBar ? styles.logo : styles.reducedLogo}>
      {isWatchingOnly && (
        <Tooltip
          content={
            <T
              id="sidebar.isWatchingOnlyTooltip"
              m="This is a watch-only wallet with limited functionality."
            />
          }>
          <div className={styles.watchOnlyIcon} />
        </Tooltip>
      )}
      <button
        aria-label="Logo"
        onClick={!expandSideBar ? onExpandSideBar : null}
        className={
          !expandSideBar
            ? styles.hamburger
            : isTestNet
            ? styles[TESTNET]
            : styles[MAINNET]
        }
      />
      {expandSideBar && (
        <button
          aria-label="Reduce sidebar"
          className={styles.reducedArrow}
          onClick={onReduceSideBar}
        />
      )}
    </div>
  )
);

export default Logo;
