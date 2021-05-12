import { wallet } from "wallet-preload-shim";
import { classNames } from "pi-ui";
import styles from "./HelpLink.module.css";

const HelpLink = ({ icon, onClick, href, title, subtitle, expand }) => (
  <div
    className={classNames(styles.icon, styles[icon])}
    onClick={onClick ? onClick : () => wallet.openExternalURL(href)}>
    <div className={styles.text}>
      <div className={styles.title}>{title}</div>
      <div className={styles.subtitle}>{subtitle}</div>
    </div>
    {expand ? (
      <div className={styles.expand} />
    ) : (
      <div className={styles.external} />
    )}
  </div>
);

export default HelpLink;
