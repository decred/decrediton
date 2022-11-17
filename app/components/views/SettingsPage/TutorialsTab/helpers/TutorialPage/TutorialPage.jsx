import { FormattedMessage as T } from "react-intl";
import { classNames, Tooltip } from "pi-ui";
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
  setActiveTabIndex,
  pagedTutorialClassname,
  tabContentWrapperClassName
}) => {
  return (
    <div>
      <div className={classNames(styles.cardWrapper)}>
        <Tooltip
          content={<T id="tutorialpage.back" m="Back" />}
          className={styles.backTooltip}>
          <div
            onClick={goBackHistory}
            className={classNames(styles.backButton, "flex-centralize")}>
            <div className={styles.backArrow}></div>
          </div>
        </Tooltip>
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
          className: pagedTutorialClassname,
          tabContentWrapperClassName,
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
  setActiveTabIndex: PropTypes.func.isRequired,
  pagedTutorialClassname: PropTypes.string,
  tabContentWrapperClassName: PropTypes.string
};

export default TutorialPage;
