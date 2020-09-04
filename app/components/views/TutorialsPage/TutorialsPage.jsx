import { Route, Switch } from "react-router-dom";
import { StandalonePage } from "layout";
import TicketLifecycle from "./TicketLifecycle";
import Staking from "./Staking";
import styles from "./TutorialsPage.module.css";

const TutorialsPage = () => (
  <StandalonePage className={styles.walletTutorial}>
    <Switch>
      <Route path="/tutorial/ticketLifecycle" component={TicketLifecycle} />
      <Route path="/tutorial/staking" component={Staking} />
    </Switch>
  </StandalonePage>
);

export default TutorialsPage;
