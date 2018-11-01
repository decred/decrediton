import GetStartedPage from "components/views/GetStartedPage";
import GetStartedPosition from "components/views/GetStartedPosition";
import LanguageSelectPage from "components/views/GetStartedPage/LanguageSelectPage";
import TutorialPage from "components/views/GetStartedPage/TutorialPage";
import PrivacyPage from "components/views/GetStartedPage/PrivacyPage";
import SpvChoicePage from "components/views/GetStartedPage/SpvChoicePage";
import { BlurableContainer } from "layout";
import { Route, Switch } from "react-router-dom";

export default () =>
  <BlurableContainer className="getstarted-page-body">
    <Switch>
      <Route path="/getstarted/language"  component={LanguageSelectPage} />
      <Route path="/getstarted/tutorial"  component={TutorialPage} />
      <Route path="/getstarted/privacy"   component={PrivacyPage} />
      <Route path="/getstarted/spvchoice" component={SpvChoicePage} />
      <Route path="/getstarted/initial"   component={GetStartedPage} />
      <Route path="/getstarted"           component={GetStartedPosition} />
    </Switch>
  </BlurableContainer>;
