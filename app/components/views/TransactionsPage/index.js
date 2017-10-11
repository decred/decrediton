// @flow
import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import TabbedPage from "../../TabbedPage";
import { FormattedMessage as T } from "react-intl";

const propTypes = {
};

@autobind
class Transactions extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { router } = this.props;
    return (
      <TabbedPage
        {...{router}}
        iconClassName="header-icon-transactions"
        title={<T id="transactions.title" m="Transactions" />}
        description={<T id="transactions.description" m="Descr" />}
        tabRoutes={[
          {title: <T id="transactions.tabSend" m="Send" />, route:"/transactions/send"},
          {title: <T id="transactions.tabReceive" m="Receive" />, route:"/transactions/receive"}
        ]}
        children={this.props.children}
      />
    )
  }
}

Transactions.propTypes = propTypes;

export default Transactions;
