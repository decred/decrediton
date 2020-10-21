import { useState, useCallback } from "react";
import TutorialPage from "./Page";
import { useDaemonStartup } from "hooks";

const Tutorial = () => {
  const { finishTutorial } = useDaemonStartup();
  const [tutorialStep, setTutorialStep] = useState(0);

  const onNextTutorialStep = useCallback(() => {
    if (tutorialStep + 1 <= 3) {
      setTutorialStep(tutorialStep + 1);
    }
  }, [tutorialStep]);

  return (
    <TutorialPage
      {...{
        tutorialStep,
        onNextTutorialStep,
        onGoToStep: setTutorialStep,
        finishTutorial
      }}
    />
  );
};

export default Tutorial;
