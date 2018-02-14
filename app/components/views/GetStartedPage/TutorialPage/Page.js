import { KeyBlueButton } from "buttons";
import "style/Tutorial.less";

const TutorialPage = ({tutorialStep, onNextTutorialStep, onGoToStep, finishTutorial}) => {
  return (
    <div className="tutorial">
      <div className="tutorial-side">
        <div className={"tutorial-side-image step-" + tutorialStep}>
        </div>
      </div>
      <div className="tutorial-main">
        <div className="tutorial-main-header">
          Tutorial Step: <span>{tutorialStep}</span>
        </div>
        <div className="tutorial-main-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id augue dui. Cras in dui libero. Etiam eget nulla vel magna ullamcorper scelerisque in vitae ipsum. Curabitur at bibendum arcu, ac mollis ante. Integer ullamcorper porta faucibus. Aenean id ante id augue pharetra porta. Nulla eu leo eget velit molestie lacinia. Sed ultricies libero a arcu mattis, quis rutrum eros hendrerit. Integer eget risus in ex auctor dapibus. Phasellus efficitur semper nisi, non pharetra leo placerat vel.
        </div>
        <div className="tutorial-main-toolbar">
          <KeyBlueButton className="next-button" onClick={tutorialStep < 4 ? onNextTutorialStep : finishTutorial} >
            Next
          </KeyBlueButton>
          <div className="tutorial-main-toolbar-step-indicators">
            <div className={tutorialStep == 0 ? "current" : tutorialStep > 0 ? "checked" : ""} onClick={tutorialStep !== 0 ? ()=>onGoToStep(0) : null}></div>
            <div className={tutorialStep == 1 ? "current" : tutorialStep > 1 ? "checked" : tutorialStep < 1 ? "unchecked" : ""} onClick={tutorialStep !== 1 ? ()=>onGoToStep(1) : null}></div>
            <div className={tutorialStep == 2 ? "current" : tutorialStep > 2 ? "checked" : tutorialStep < 2 ? "unchecked" : ""} onClick={tutorialStep !== 2 ? ()=>onGoToStep(2) : null}></div>
            <div className={tutorialStep == 3 ? "current" : tutorialStep > 3 ? "checked" : tutorialStep < 3 ? "unchecked" : ""} onClick={tutorialStep !== 3 ? ()=>onGoToStep(3) : null}></div>
            <div className={tutorialStep == 4 ? "current" : tutorialStep > 4 ? "checked" : tutorialStep < 4 ? "unchecked" : ""} onClick={tutorialStep !== 4 ? ()=>onGoToStep(4) : null}></div>
          </div>
          {tutorialStep < 4 &&
            <KeyBlueButton className="skip-button" onClick={finishTutorial}>
              Skip
            </KeyBlueButton>
          }
        </div>
      </div>
    </div>
  );
};
export default TutorialPage;
