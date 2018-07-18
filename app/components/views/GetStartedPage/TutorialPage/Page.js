import { KeyBlueButton, InvisibleButton } from "buttons";
import "style/Tutorial.less";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import { StepIndicator } from "indicators";
import { onboard01, onboard02, onboard03, onboard04 } from "assets/videos";

const docByStep = {
  0: "GetStartedTutorialPage01",
  1: "GetStartedTutorialPage02",
  2: "GetStartedTutorialPage03",
  3: "GetStartedTutorialPage04",
};

const videosByStep = {
  0: onboard01,
  1: onboard02,
  2: onboard03,
  3: onboard04,
};

const TutorialPage = ({ tutorialStep, onNextTutorialStep, onGoToStep, finishTutorial }) => {
  return (
    <div className="getstarted-tutorial">
      <div className={"tutorial-side step-" + tutorialStep}>
        <video autoPlay loop src={videosByStep[tutorialStep]} width="100%" />
      </div>

      <div className="tutorial-main">
        <div className="tutorial-main-text">
          <Documentation name={docByStep[tutorialStep]} />
        </div>

        <div className="tutorial-main-toolbar">
          <KeyBlueButton className="next-button" onClick={tutorialStep < 3 ? onNextTutorialStep : finishTutorial} >
            <T id="tutorial.nextBtn" m={"Next"}/>
          </KeyBlueButton>

          <StepIndicator
            currentPageIndex={tutorialStep}
            pageCount={4}
            onGotoPage={onGoToStep}
          />

          <InvisibleButton className="skip-button" onClick={finishTutorial}>
            { tutorialStep < 3
              ? <T id="tutorial.skipBtn" m={"Skip"}/>
              : <T id="tutorial.finishBtn" m={"Finish"}/> }
          </InvisibleButton>
        </div>
      </div>
    </div>
  );
};
export default TutorialPage;
