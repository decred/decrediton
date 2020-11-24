import { RescanButton, RescanCancelButton } from "buttons";
import styles from "./MenuBottom.module.css";
import SettingsIconLink from "./SettingsIconLink/SettingsIconLink";
import SpvIcon from "./SpvIcon/SpvIcon";

const MenuBottomCollapsed = ({
  rescanRequest,
  rescanAttempt,
  rescanCancel,
  sidebarOnBottom,
  isSPV
}) => (
  <>
    {!sidebarOnBottom && (
      <div className={styles.bottomBarCollapsed}>
        <SpvIcon isSPV={isSPV} />
        <div className={styles.rescanButtonAreaCollapsed}>
          <RescanButton {...{ rescanRequest, rescanAttempt }} />
          {rescanRequest && (
            <RescanCancelButton {...{ rescanRequest, rescanCancel }} />
          )}
        </div>
        <SettingsIconLink className={styles.settingsLinkCollapsed} />
      </div>
    )}
  </>
);

export default MenuBottomCollapsed;
