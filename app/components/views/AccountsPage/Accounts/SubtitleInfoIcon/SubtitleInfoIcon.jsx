import { InfoDocModalButton } from "buttons";
import styles from "./SubtitleInfoIcon.module.css";

const SubtitleInfoIcon = React.memo(() => (
  <div className={styles.titleButtonsArea}>
    <InfoDocModalButton
      document="BalanceOverviewInfo"
      modalClassName={styles.infoFields}
      double
      draggable
    />
  </div>
));

export default SubtitleInfoIcon;
