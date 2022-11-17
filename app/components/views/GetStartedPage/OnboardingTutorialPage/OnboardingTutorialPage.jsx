import {
  TutorialPage,
  tutorials
} from "../../SettingsPage/TutorialsTab/helpers";
import styles from "./OnboardingTutorialPage.module.css";
import { useOnboardingTutorials } from "./hooks";

const OnboardingTutorialPage = ({ goBackHistory, currentTutorial }) => {
  const {
    visitedTutorialTabs,
    setVisitedTutorialTabs,
    activeTabIndexes,
    setActiveTabIndexes
  } = useOnboardingTutorials();

  return (
    <div className={styles.container}>
      <TutorialPage
        {...{
          name: currentTutorial,
          tutorials,
          goBackHistory,
          visitedTabs: visitedTutorialTabs[currentTutorial],
          setVisitedTabs: (newCheckedTabs) =>
            setVisitedTutorialTabs({
              ...visitedTutorialTabs,
              [currentTutorial]: newCheckedTabs
            }),
          activeTabIndex: activeTabIndexes[currentTutorial],
          setActiveTabIndex: (newActiveTabIndex) =>
            setActiveTabIndexes({
              ...activeTabIndexes,
              [currentTutorial]: newActiveTabIndex
            }),
          pagedTutorialClassname: styles.pagedTutorial,
          tabContentWrapperClassName: styles.tabContentWrapper
        }}
      />
    </div>
  );
};

export default OnboardingTutorialPage;
