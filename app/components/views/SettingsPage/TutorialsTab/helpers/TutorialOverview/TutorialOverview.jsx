import TutorialCard from "../TutorialCard";
import styles from "./TutorialOverview.module.css";
import { classNames } from "pi-ui";

const TutorialOverview = ({
  name,
  tutorials,
  visitedTabs,
  activeTabIndex,
  viewTutorialHandler
}) => (
  <div
    onClick={() => viewTutorialHandler(name)}
    className={classNames(styles.cardWrapper)}>
    <TutorialCard
      {...{
        name,
        tutorials,
        visitedTabs,
        activeTabIndex,
        className: styles.overview
      }}
    />
    <div className={classNames(styles.continueButton, "flex-centralize")}>
      <div className={styles.continueArrow}></div>
    </div>
  </div>
);

TutorialOverview.propTypes = {
  name: PropTypes.string.isRequired,
  tutorials: PropTypes.object.isRequired,
  visitedTabs: PropTypes.array,
  activeTabIndex: PropTypes.number,
  viewTutorialHandler: PropTypes.func.isRequired
};

export default TutorialOverview;
