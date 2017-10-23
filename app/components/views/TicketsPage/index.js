// @flow
import Header from "./Header";
import { RouteTransition } from "shared";

const enterLeft = { atEnter: { offset: -100 }, atActive: { offset: 0 }, atLeave: { offset: 100 }, mapStyles: (styles) => ({ transform: `translateX(${styles.offset}%)` })};
const enterRight = { atEnter: { offset: 100 }, atActive: { offset: 0 }, atLeave: { offset: -100 }, mapStyles: (styles) => ({ transform: `translateX(${styles.offset}%)` })};
const opts = { stiffness: 150, damping: 20 };

const Tickets = ({ children, location }) => {
  const tabs = ["purchase", "mytickets", "governance", "statistics"];
  const page = "tickets";
  // this will be removed w/ react router 4
  const pathname = location.pathname.split("/")[2];
  const effect = pathname === "purchase" ? enterLeft : enterRight;
  return (
    <div className="page-view">
      <Header {...{ tabs, page, pathname }}/>
      <div className="tabbedpage-content">
      <RouteTransition {...{ opts, pathname, ...effect }}>
        { children }
      </RouteTransition>
      </div>
    </div>
  );
};

Tickets.propTypes = { location: PropTypes.object.isRequired };

export default Tickets;

/*

// @flow
import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import TabbedPage from "../../TabbedPage";
import { FormattedMessage as T } from "react-intl";
import { withTabSlide } from "../../PageTransitions";
import tickets from "../../../connectors/ticketsPage";
import Balance from "../../Balance";

const propTypes = {
  router: PropTypes.object.isRequired,
  ticketPrice: PropTypes.number.isRequired
};

@autobind
class Tickets extends React.Component {
  render() {
    const { router, ticketPrice } = this.props;
    return (
      <TabbedPage
        {...{router}}
        iconClassName="header-icon-tickets"
        title={<T id="tickets.title" m="Tickets" />}
        description={(
          <div>
            <T id="tickets.description.currentPrice" m="Current Ticket Price" />
            <Balance amount={ticketPrice}/>
          </div>
        )}
        tabRoutes={[
          {title: <T id="tickets.tabPurchase" m="Purchase Tickets" />, route:"/tickets/purchase"},
          {title: <T id="tickets.tabMyTickets" m="My Tickets" />, route:"/tickets/mytickets"},
          {title: <T id="tickets.tabGovernance" m="Governance" />, route:"/tickets/governance"},
          {title: <T id="tickets.tabPStatistics" m="Statistics" />, route:"/tickets/statistics"}
        ]}
        children={this.props.children}
      />
    );
  }
}

Tickets.propTypes = propTypes;

export default withTabSlide(tickets(Tickets));
*/
