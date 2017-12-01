import React, { Component } from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import TicketPurchase from "./TicketPurchase";
import Vote from "./Vote";
import Revocation from "./Revocation";
import Send from "./Send";
import Receive from "./Receive";
import Transfer from "./Transfer";

@autobind
class TxRow extends Component {
  render() {
    const {
      date,
      pending,
      tx
    } = this.props;
    const Component = (tx.txType === "Ticket") ? (
      TicketPurchase
    ) : (tx.txType === "Vote") ? (
      Vote
    ) : (tx.txType === "Revocation") ? (
      Revocation
    ) : (tx.txDirection === "out") ? (
      Send
    ) : (tx.txDirection === "in") ? (
      Receive
    ) : (tx.txDirection === "transfer") ? (
      Transfer
    ) : null;

    return Component ? (
      <Component
        {...{
          ...tx,
          date,
          pending,
          onClick: () => this.context.router.push(`/transactions/history/${tx.txHash}`),
          receiveAddressStr: (tx.txDescription.addressStr || []).join(", "),
        }}
      />
    ) : null;
  }
}

TxRow.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default TxRow;
