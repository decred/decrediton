import { Link } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";

export default () => (
  <div className="overview-no-tickets">
    <Link to="/tutorial/staking" className="whatIsStaking">
      <T id="home.noTickets.staking" m="What is Staking (Proof-of-Stake)?" /> →
    </Link>
    <Link to="/tutorial/ticketLifecycle" className="ticketLifeCycle">
      <T id="home.noTickets.lifecycle" m="Learn About the Ticket Lifecycle" /> →
    </Link>
  </div>
);
