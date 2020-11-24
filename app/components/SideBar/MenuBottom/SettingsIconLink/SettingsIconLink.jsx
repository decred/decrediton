import { FormattedMessage as T } from "react-intl";
import { NavLink as Link } from "react-router-dom";
import { Tooltip } from "shared";
import styles from "./SettingsIconLink.module.css";

const SettingsIconLink = ({ className }) => (
  <Tooltip text={<T id="sidebar.settings" m="Settings" />}>
    <Link className={className} to="/settings" aria-label="settings">
      <div className={styles.settingsIcon}></div>
    </Link>
  </Tooltip>
);

export default SettingsIconLink;
