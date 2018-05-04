import { KeyBlueButton, InvisibleButton } from "buttons";
import "style/Tutorial.less";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import { StepIndicator } from "indicators";

const docByStep = {
  0: "GetStartedTutorialPage00",
  1: "GetStartedTutorialPage01",
  2: "GetStartedTutorialPage02",
  3: "GetStartedTutorialPage03",
  4: "GetStartedTutorialPage04",
};

const TutorialPage = ({ tutorialStep, onNextTutorialStep, onGoToStep, finishTutorial }) => {
  return (
    <div className="getstarted-tutorial">
      <div className={"tutorial-side step-" + tutorialStep}>
        <div className={"tutorial-side-image step-" + tutorialStep}>
        </div>
      </div>

      <div className="tutorial-main">
        <div className="tutorial-main-text">
          <Documentation name={docByStep[tutorialStep]} />
        </div>

        <div className="tutorial-main-toolbar">
          <KeyBlueButton className="next-button" onClick={tutorialStep < 4 ? onNextTutorialStep : finishTutorial} >
            <T id="tutorial.nextBtn" m={"Next"}/>
          </KeyBlueButton>

          <StepIndicator
            currentPageIndex={tutorialStep}
            pageCount={5}
            onGotoPage={onGoToStep}
          />

          {tutorialStep < 4 &&
            <InvisibleButton className="skip-button" onClick={finishTutorial}>
              <T id="tutorial.skipBtn" m={"Skip"}/>
            </InvisibleButton>
          }
        </div>
      </div>
    </div>
  );
};
export default TutorialPage;
