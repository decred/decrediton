import { classNames } from "pi-ui";
import styles from "./TutorialPage.module.css";
import TutorialCard from "../TutorialCard";
import PagedTutorial from "../PagedTutorial";

const TutorialPage = ({
  name,
  tutorials,
  goBackHistory,
  visitedTabs,
  setVisitedTabs,
  activeTabIndex,
  setActiveTabIndex
}) => {
  return (
    <div>
      <div className={classNames(styles.cardWrapper)}>
        <div
          className={classNames(styles.backButton, "flex-centralize")}
          onClick={goBackHistory}>
          <div className={styles.backArrow}></div>
        </div>
        <TutorialCard
          {...{
            name,
            tutorials,
            visitedTabs,
            activeTabIndex: activeTabIndex ?? 0
          }}
        />
      </div>
      <PagedTutorial
        {...{
          visitedTabs,
          setVisitedTabs,
          slides: tutorials[name].slides,
          activeTabIndex,
          setActiveTabIndex,
          onFinish: goBackHistory
        }}
      />
    </div>
  );
};

TutorialPage.propTypes = {
  name: PropTypes.string.isRequired,
  tutorials: PropTypes.object.isRequired,
  goBackHistory: PropTypes.func.isRequired,
  visitedTabs: PropTypes.array,
  setVisitedTabs: PropTypes.func.isRequired,
  activeTabIndex: PropTypes.number,
  setActiveTabIndex: PropTypes.func.isRequired
};

export default TutorialPage;
