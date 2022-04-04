import styles from "./CreationWarning.module.css";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";
import { Subtitle } from "shared";
import {
  PagedTutorial,
  tutorials
} from "../../../SettingsPage/TutorialsTab/helpers";
import { useCreationWarning } from "./hooks";

const CreationWarning = ({ onAcceptCreationWarning }) => {
  const {
    visitedTutorialTabs,
    setVisitedTutorialTabs,
    activeTabIndexes,
    setActiveTabIndexes
  } = useCreationWarning();
  const currentTutorial = "ln";
  const slides = tutorials[currentTutorial].slides;

  const isAcceptCreationWarningButtonEnabled = slides.reduce(
    (acc, _, i) => (acc &= visitedTutorialTabs[currentTutorial]?.includes(i)),
    true
  );

  return (
    <div className={styles.container}>
      <Subtitle
        className={styles.header}
        title={<T id="ln.creationWarning.title" m="Before You continue..." />}>
        <KeyBlueButton
          onClick={onAcceptCreationWarning}
          disabled={!isAcceptCreationWarningButtonEnabled}>
          <T
            id="ln.createWalletWarning.okBtn"
            m="I understand and accept the risks"
          />
        </KeyBlueButton>
      </Subtitle>
      <div className={styles.desc}>
        <T
          id="ln.creationWarning.desc"
          m="Please understand that Lightning Network is still a work in progress and should be used with caution. In particular:"
        />
      </div>
      <PagedTutorial
        {...{
          slides: tutorials.ln.slides,
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

export default CreationWarning;
