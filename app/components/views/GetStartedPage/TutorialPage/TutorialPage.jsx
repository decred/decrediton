import { useState, useCallback } from "react";
import TutorialPage from "./Page";
import { useDaemonStartup } from "connectors";

const Tutorial = () => {
  const { finishTutorial } = useDaemonStartup();
  const [tutorialStep, setTutorialStep] = useState(0);

  const onNextTutorialStep = useCallback(() => {
    if (tutorialStep + 1 <= 3) {
      setTutorialStep(tutorialStep + 1);
    }
  }, [tutorialStep]);

  const onPrevTutorialStep = useCallback(() => {
    if (tutorialStep - 1 >= 0) {
      setTutorialStep(tutorialStep - 1);
    }
  }, [tutorialStep]);

  return (
    <TutorialPage
      {...{
        tutorialStep,
        onNextTutorialStep,
        onPrevTutorialStep,
        onGoToStep: setTutorialStep,
        finishTutorial
      }}
    />
  );
};

export default Tutorial;
