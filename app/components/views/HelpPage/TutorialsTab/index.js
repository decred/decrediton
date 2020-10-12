import { FormattedMessage as T } from "react-intl";
import { DescriptionHeader } from "layout";
import { Subtitle } from "shared";
import { Link } from "react-router-dom";
import recentTicketsStyles from "../../HomePage/RecentTickets/RecentTickets.module.css";

export const TutorialsTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="help.description.tutorials"
        m="Learn about the various aspects of the Decred network."
      />
    }
  />
);

export const TutorialsTab = () => (
  <>
    <Subtitle title={<T id="tutorials.subtitle" m="Tutorials" />} />
    <div className={recentTicketsStyles.overviewNoTickets}>
      {/* <Link to="/mytickets/purchase" className="purchaseTickets">
        <T id="home.noTickets.purchase" m="Stake Your Idle DCR and Earn Rewards" /> →
      </Link> */}
      <Link to="/tutorial/staking" className={recentTicketsStyles.whatIsStaking}>
        <T id="tutorials.staking" m="What is Staking (Proof-of-Stake)?" /> →
      </Link>
      <Link to="/tutorial/ticketLifecycle" className={recentTicketsStyles.ticketLifeCycle}>
        <T
          id="tutorials.ticketLifecycle"
          m="Learn About the Ticket Lifecycle"
        />{" "}
        →
      </Link>
    </div>
  </>
);
