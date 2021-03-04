import { classNames } from "pi-ui";
import styles from "./TitleHeader.module.css";

const TitleHeader = ({ title, iconClassName, optionalButton }) => (
  <div className={classNames(styles.container, "is-row")}>
    <div className="is-row">
      <div className={styles.icon}>
        <div className={styles[iconClassName]} />
      </div>
      <div className={styles.title}>{title}</div>
    </div>
    {optionalButton && (
      <div className={styles.button}>{optionalButton}</div>
    )}
  </div>
);

export default TitleHeader;
