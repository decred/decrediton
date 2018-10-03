import { FormattedMessage as T } from "react-intl";
import { DescriptionHeader } from "layout";
import { Link } from "react-router-dom";

export const TutorialsTabHeader = () =>
  <DescriptionHeader
    description={<T id="help.description.tutorials" m="Learn about the various aspects of the Decred network." />}
  />;

export const TutorialsTab = () => (
  <Aux>
    <div className="tabbed-page-subtitle"><T id="tutorials.subtitle" m="Tutorials"/></div>
    <div className="overview-no-tickets">
      {/* <Link to="/mytickets/purchase" className="purchaseTickets">
        <T id="home.noTickets.purchase" m="Stake Your Idle DCR and Earn Rewards" /> →
      </Link> */}
      <Link to="/tutorial/staking" className="whatIsStaking">
        <T id="tutorials.staking" m="What is Staking (Proof-of-Stake)?" /> →
      </Link>
      <Link to="/tutorial/ticketLifecycle" className="ticketLifeCycle">
        <T id="tutorials.ticketLifecycle" m="Learn About the Ticket Lifecycle" /> →
      </Link>
    </div>
  </Aux>
);
