import styles from "./StakingTabWarning.module.css";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";
import { Subtitle } from "shared";
import {
  PagedTutorial,
  tutorials
} from "../../SettingsPage/TutorialsTab/helpers";
import { useStakingTabWarning } from "./hooks";

const StakingTabWarning = ({ onAcceptCreationWarning }) => {
  const {
    visitedTutorialTabs,
    setVisitedTutorialTabs,
    activeTabIndexes,
    setActiveTabIndexes
  } = useStakingTabWarning();
  const currentTutorial = "tickets";
  const slides = tutorials[currentTutorial].slides;

  const isAcceptCreationWarningButtonEnabled = slides.reduce(
    (acc, _, i) => (acc &= visitedTutorialTabs[currentTutorial]?.includes(i)),
    true
  );

  return (
    <div className={styles.container}>
      <Subtitle
        className={styles.header}
        title={<T id="stakingTabWarning.title" m="Before You continue..." />}>
        <KeyBlueButton
          onClick={onAcceptCreationWarning}
          disabled={!isAcceptCreationWarningButtonEnabled}>
          <T
            id="stakingTabWarning.okBtn"
            m="I understand and accept the risks"
          />
        </KeyBlueButton>
      </Subtitle>
      <div className={styles.desc}>
        <T
          id="stakingTabWarning.desc"
          m="Please take a look at the basics of tickets/staking:"
        />
      </div>
      <PagedTutorial
        {...{
          slides: tutorials[currentTutorial].slides,
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
    </div>
  );
};

export default StakingTabWarning;
