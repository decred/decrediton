import { Switch, Route } from "react-router-dom";
import TicketsOverview from "./TicketsOverview";
import TicketsList from "./TicketListPage";

const MyTickets = () => (
  <div className="">
    <Switch>
      <Route path="/tickets/mytickets" exact component={TicketsOverview} />
      <Route path="/tickets/mytickets/:status" component={TicketsList} />
    </Switch>
  </div>
);

export default MyTickets;
