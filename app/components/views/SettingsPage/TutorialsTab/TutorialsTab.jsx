import { FormattedMessage as T } from "react-intl";
import { Subtitle } from "shared";
import { TutorialOverview, TutorialPage, tutorials } from "./helpers";
import { useTutorialsTab } from "./hooks";

const TutorialsTab = () => {
  const {
    currentTutorial,
    viewTutorialHandler,
    visitedTutorialTabs,
    setVisitedTutorialTabs,
    activeTabIndexes,
    setActiveTabIndexes,
    goBackHistory
  } = useTutorialsTab();

  return currentTutorial ? (
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
          })
      }}
    />
  ) : (
    <>
      <Subtitle
        title={<T id="tutorials.learnAboutDecred" m="Learn about decred" />}
      />
      {[
        "decredIntro",
        "ln",
        "consensusCode",
        "powPos",
        "tickets",
        "staking",
        "lifecycle",
        "consensusVoting",
        "blocks",
        "identity"
      ].map((name) => (
        <TutorialOverview
          {...{
            key: name,
            name,
            tutorials,
            visitedTabs: visitedTutorialTabs[name],
            activeTabIndex: activeTabIndexes[name],
            viewTutorialHandler
          }}
        />
      ))}
    </>
  );
};

export default TutorialsTab;
