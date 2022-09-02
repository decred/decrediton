import { classNames } from "pi-ui";
import styles from "./TitleHeader.module.css";
import { DocButton } from "buttons";

const TitleHeader = ({ title, iconType, optionalButton, docUrl }) => (
  <div className={classNames(styles.container, "flex-row")}>
    <div className="flex-row">
      {iconType && (
        <div className={styles.icon}>
          <div className={styles[iconType]} data-testid="title-header-icon" />
        </div>
      )}
      <div className={styles.title} data-testid="title-header">
        {title}
        {docUrl && <DocButton className={styles.docButton} docUrl={docUrl} />}
      </div>
    </div>
    {optionalButton && <div className={styles.button}>{optionalButton}</div>}
  </div>
);

export default TitleHeader;
