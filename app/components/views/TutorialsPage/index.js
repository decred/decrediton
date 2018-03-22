import { Route, Switch } from "react-router-dom";
import TicketLifecycle from "./TicketLifecycle";
import Staking from "./Staking";
import { StandalonePage } from "layout";
import "style/Tutorial.less";

export default () => (
  <StandalonePage className="wallet-tutorial">
    <Switch>
      <Route path="/tutorial/ticketLifecycle" component={TicketLifecycle} />
      <Route path="/tutorial/staking" component={Staking} />
    </Switch>
  </StandalonePage>
);
