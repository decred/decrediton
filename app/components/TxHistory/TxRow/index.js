// @flow
import React, { Component } from "react";
import { autobind } from "core-decorators";
import Radium from "radium";
import { TransactionDetails }  from "../../../middleware/walletrpc/api_pb";
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
      showTxDetail,
      txInfo,
      direction,
      txAmount,
      txDescription,
      pending,
      date,
      accountName,
      type
    } = this.props;
    const receiveAddressStr = (txDescription.addressStr || []).join(", ");
    const onClick = showTxDetail ? this.onClick : null;
    const Component = (type === TransactionDetails.TransactionType.TICKET_PURCHASE) ? (
      TicketPurchase
    ) : (type === TransactionDetails.TransactionType.VOTE) ? (
      Vote
    ) : (type === TransactionDetails.TransactionType.REVOCATION) ? (
      Revocation
    ) : (direction === "out") ? (
      Send
    ) : (direction === "in") ? (
      Receive
    ) : (direction === "transfer") ? (
      Transfer
    ) : null;
    return Component ? (
      <Component
        {...{
          txInfo,
          direction,
          txAmount,
          txDescription,
          receiveAddressStr,
          pending,
          date,
          accountName,
          type,
          onClick
        }}
      />
    ) : null;
  }

  onClick() {
    const { showTxDetail, txInfo, type } = this.props;
    showTxDetail ? showTxDetail(txInfo, type) : null;
  }
}

export default Radium(TxRow);
