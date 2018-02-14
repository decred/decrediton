import "style/GetStarted.less";
import "style/Layout.less";
import { KeyBlueButton } from "buttons";

const TutorialPage = ({tutorialStep, onNextTutorialStep, onPrevTutorialStep, finishTutorial}) => {
  return (
    <div className="page-view">
      <div className="page-content-fixed">
        Tutorial Step: <span>{tutorialStep}</span>
        <KeyBlueButton onClick={onPrevTutorialStep} >
          Previous
        </KeyBlueButton>
        <KeyBlueButton onClick={onNextTutorialStep} >
          Next
        </KeyBlueButton>
        <KeyBlueButton onClick={finishTutorial}>
          Finish
        </KeyBlueButton>
      </div>
    </div>
  );
};
export default TutorialPage;
