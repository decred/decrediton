import GetStartedPage from "components/views/GetStartedPage";
import GetStartedPosition from "components/views/GetStartedPosition";
import LanguageSelectPage from "components/views/GetStartedPage/LanguageSelectPage";
import TutorialPage from "components/views/GetStartedPage/TutorialPage";
import { Route, Switch } from "react-router-dom";

export default () =>
  <Switch>
    <Route path="/getstarted/language"  component={LanguageSelectPage} />
    <Route path="/getstarted/tutorial"  component={TutorialPage} />
    <Route path="/getstarted/initial"   component={GetStartedPage} />
    <Route path="/getstarted"           component={GetStartedPosition} />
  </Switch>;
