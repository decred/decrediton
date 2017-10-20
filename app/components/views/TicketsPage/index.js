// @flow
import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import TabbedPage from "../../TabbedPage";
import { FormattedMessage as T } from "react-intl";
import { withTabSlide } from "../../PageTransitions";
import tickets from "../../../connectors/ticketsPage";

const propTypes = {
  router: PropTypes.object.isRequired,
  isTestNet: PropTypes.bool.isRequired,
};

@autobind
class Tickets extends React.Component {
  render() {
    const { router, isTestNet } = this.props;
    return (
      <TabbedPage
        {...{router}}
        iconClassName="header-icon-transactions"
        title={<T id="tickets.title" m="Tickets" />}
        description={(
          isTestNet
            ? <T id="transactions.description.testnet" m="Testnet Decred addresses always begin with letter T and contain 26-35 alphanumeric characters (e.g. TxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0)." />
            : <T id="transactions.description.mainnet" m="Mainnet Decred addresses always begin with letter D and contain 26-35 alphanumeric characters (e.g. DxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X)." />
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
