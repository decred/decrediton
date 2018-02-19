import GetStartedPage from "components/views/GetStartedPage";
import GetStartedPosition from "components/views/GetStartedPosition";
import LanguageSelectPage from "components/views/GetStartedPage/LanguageSelectPage";
import TutorialPage from "components/views/GetStartedPage/TutorialPage";
import { Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

const pageAnimation = { atEnter: { opacity: 0 }, atLeave: { opacity: 0 }, atActive: { opacity: 1 } };

export default () =>
  <div className="page-body getstarted">
    <AnimatedSwitch {...pageAnimation}>
      <Route path="/getstarted/language"  component={LanguageSelectPage} />
      <Route path="/getstarted/tutorial"  component={TutorialPage} />
      <Route path="/getstarted/initial"   component={GetStartedPage} />
      <Route path="/getstarted"           component={GetStartedPosition} />
    </AnimatedSwitch>
  </div>;
