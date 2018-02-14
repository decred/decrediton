import { KeyBlueButton } from "buttons";
import "style/Tutorial.less";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";

const messages = defineMessages({
  step0Title: {
    id: "tutorial.step.0.title",
    defaultMessage: "What is the Decred Blockchain?",
    description: "string"
  },
  step0Text: {
    id: "tutorial.step.0.text",
    defaultMessage: "Step 0 text",
    description: "string"
  },
  step1Title: {
    id: "tutorial.step.1.title",
    defaultMessage: "What is a Wallet?",
    description: "string"
  },
  step1Text: {
    id: "tutorial.step.1.text",
    defaultMessage: "Step 1 text",
    description: "string"
  },
  step2Title: {
    id: "tutorial.step.2.title",
    defaultMessage: "Key to Your Wallet",
    description: "string"
  },
  step2Text: {
    id: "tutorial.step.2.text",
    defaultMessage: "Step 2 text",
    description: "string"
  },
  step3Title: {
    id: "tutorial.step.3.title",
    defaultMessage: "Staking and Governance",
    description: "string"
  },
  step3Text: {
    id: "tutorial.step.3.text",
    defaultMessage: "Step 3 text",
    description: "string"
  },
  step4Title: {
    id: "tutorial.step.4.title",
    defaultMessage: "Safety Tips",
    description: "string"
  },
  step4Text: {
    id: "tutorial.step.4.text",
    defaultMessage: "Step 4 text",
    description: "string"
  },
});

const TutorialPage = ({intl, tutorialStep, onNextTutorialStep, onGoToStep, finishTutorial}) => {
  return (
    <div className="tutorial">
      <div className="tutorial-side">
        <div className={"tutorial-side-image step-" + tutorialStep}>
        </div>
      </div>
      <div className="tutorial-main">
        <div className="tutorial-main-header">
          {{
            0: intl.formatMessage(messages.step0Title),
            1: intl.formatMessage(messages.step1Title),
            2: intl.formatMessage(messages.step2Title),
            3: intl.formatMessage(messages.step3Title),
            4: intl.formatMessage(messages.step4Title),
          }[tutorialStep]}
        </div>
        <div className="tutorial-main-text">
          {{
            0: intl.formatMessage(messages.step0Text),
            1: intl.formatMessage(messages.step1Text),
            2: intl.formatMessage(messages.step2Text),
            3: intl.formatMessage(messages.step3Text),
            4: intl.formatMessage(messages.step4Text),
          }[tutorialStep]}
        </div>
        <div className="tutorial-main-toolbar">
          <KeyBlueButton className="next-button" onClick={tutorialStep < 4 ? onNextTutorialStep : finishTutorial} >
            <T id="tutorial.nextBtn" m={"Next"}/>
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
              <T id="tutorial.skipBtn" m={"Skip"}/>
            </KeyBlueButton>
          }
        </div>
      </div>
    </div>
  );
};
export default injectIntl(TutorialPage);
