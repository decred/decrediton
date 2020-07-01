import { useState, useCallback } from "react";
import TutorialPage from "./Page";
import { daemonStartup } from "connectors"; // xxxx: hook the hook

const Tutorial = ({ finishTutorial }) => {
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

export default daemonStartup(Tutorial);
