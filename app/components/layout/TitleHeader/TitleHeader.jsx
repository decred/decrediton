import { classNames } from "pi-ui";
import styles from "./TitleHeader.module.css";

const TitleHeader = ({ title, iconType, optionalButton }) => (
  <div className={classNames(styles.container, "flex-row")}>
    <div className="flex-row">
      <div className={styles.icon}>
        <div className={styles[iconType]} />
      </div>
      <div className={styles.title}>{title}</div>
    </div>
    {optionalButton && <div className={styles.button}>{optionalButton}</div>}
  </div>
);

export default TitleHeader;
