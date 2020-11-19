import { NavLink as Link } from "react-router-dom";
import styles from "./SettingsIconLink.module.css";

const SettingsIconLink = ({ className }) => (
  <Link className={className} to="/settings" aria-label="settings">
    <div className={styles.settingsIcon}></div>
  </Link>
);

export default SettingsIconLink;
