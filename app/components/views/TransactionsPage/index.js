// @flow
import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import TabbedPage from "../../TabbedPage";
import { FormattedMessage as T } from "react-intl";
import { withTabSlide } from "../../PageTransitions";
import transactions from "../../../connectors/transactionsPage";

const propTypes = {
  router: PropTypes.object.isRequired,
  isTestNet: PropTypes.bool.isRequired,
};

@autobind
class Transactions extends React.Component {
  render() {
    const { router, isTestNet } = this.props;
    return (
      <TabbedPage
        {...{router}}
        iconClassName="header-icon-transactions"
        title={<T id="transactions.title" m="Transactions" />}
        description={(
          isTestNet
            ? <T id="transactions.description.testnet" m="Testnet Decred addresses always begin with letter T and contain 26-35 alphanumeric characters (e.g. TxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0)." />
            : <T id="transactions.description.mainnet" m="Mainnet Decred addresses always begin with letter D and contain 26-35 alphanumeric characters (e.g. DxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X)." />
        )}
        tabRoutes={[
          {title: <T id="transactions.tabSend" m="Send" />, route:"/transactions/send"},
          {title: <T id="transactions.tabReceive" m="Receive" />, route:"/transactions/receive"}
        ]}
        children={this.props.children}
      />
    );
  }
}

Transactions.propTypes = propTypes;

export default withTabSlide(transactions(Transactions));
