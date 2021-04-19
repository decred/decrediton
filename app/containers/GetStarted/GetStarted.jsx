import {
  GetStartedPage,
  LanguageSelectPage,
  TutorialPage,
  PrivacyPage,
  SpvChoicePage,
  CreateWalletPage
} from "components/views/GetStartedPage";
import GetStartedPosition from "components/views/GetStartedPosition";
import { BlurableContainer } from "layout";
import { Route, Switch } from "react-router-dom";
import styles from "./GetStarted.module.css";

const GetStarted = () => (
  <BlurableContainer className={styles.getStartedBody}>
    <Switch>
      <Route path="/getstarted/language" component={LanguageSelectPage} />
      <Route
        path="/getstarted/createwallet/:isNew"
        component={CreateWalletPage}
      />
      <Route path="/getstarted/tutorial" component={TutorialPage} />
      <Route path="/getstarted/privacy" component={PrivacyPage} />
      <Route path="/getstarted/spvchoice" component={SpvChoicePage} />
      <Route path="/getstarted/initial" component={GetStartedPage} />
      <Route path="/getstarted" component={GetStartedPosition} />
    </Switch>
  </BlurableContainer>
);

export default GetStarted;
