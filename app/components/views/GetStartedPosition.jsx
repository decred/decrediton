import { useEffect } from "react";
import { useDaemonStartup } from "hooks";

const GetStartedPosition = () => {
  const {
    setLanguage,
    onShowLanguage,
    showPrivacy,
    onShowPrivacy,
    showSpvChoice,
    onShowGetStarted,
    onShowSpvChoice,
    onShowTutorial,
    showTutorial
  } = useDaemonStartup();
  useEffect(() => {
    if (setLanguage) {
      onShowLanguage();
    } else if (showPrivacy) {
      onShowPrivacy();
    } else if (showSpvChoice) {
      onShowSpvChoice();
    } else if (showTutorial) {
      onShowTutorial();
    } else {
      onShowGetStarted();
    }
  }, [
    setLanguage,
    onShowLanguage,
    showPrivacy,
    onShowPrivacy,
    showSpvChoice,
    onShowGetStarted,
    onShowSpvChoice,
    onShowTutorial,
    showTutorial
  ]);
  return <></>;
};

export default GetStartedPosition;
