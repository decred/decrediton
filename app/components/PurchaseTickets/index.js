import React from "react";
import { autobind } from "core-decorators";
import { substruct, compose, eq, get } from "../../fp";
import PurchaseTicketsForm from "./Form";
import purchaseTickets from "../../connectors/purchaseTickets";

@autobind
class PurchaseTickets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingAdvanced: false,
      numTicketsToBuy: 1,
      ticketFee: 0.001, // DCR/kB
      txFee: 0.001, // DCR/kB
      conf: 0,
      expiry: 16
    };
  }

  render() {
    return (
      <PurchaseTicketsForm
        {...{
          ...this.props,
          ...this.state,
          canAffordTickets: this.getCanAffordTickets(),
          stakePool: this.getStakePool(),
          account: this.getAccount(),
          ...this.getErrors(),
          ...substruct({
            onShowAdvanced: null,
            onHideAdvanced: null,
            onToggleShowAdvanced: null,
            onIncrementNumTickets: null,
            onDecrementNumTickets: null,
            onChangeStakePool: null,
            onChangeAccount: null,
            onChangeTicketFee: null,
            onChangeTxFee: null,
            onChangeExpiry: null,
            onRequestPassphrase: null
          }, this)
        }}
      />
    );
  }

  getStakePool() {
    const pool = this.props.onChangeStakePool ? this.props.stakePool : this.state.stakePool;
    return pool
      ? this.props.configuredStakePools.find(compose(eq(pool.Host), get("Host")))
      : null;
  }

  getAccount() {
    const account = this.props.onChangeAccount ? this.props.account : this.state.account;
    return this.props.spendingAccounts.find(compose(eq(account.value), get("value")));
  }

  getCanAffordTickets() {
    return this.getAccount().spendable > (this.props.ticketPrice * this.state.numTicketsToBuy);
  }

  onHideAdvanced() {
    this.setState({ isShowingAdvanced: false });
  }

  onShowAdvanced() {
    this.setState({ isShowingAdvanced: true });
  }

  onToggleShowAdvanced() {
    this.state.isShowingAdvanced ? this.onHideAdvanced() : this.onShowAdvanced();
  }

  onChangeStakePool(stakePool) {
    const { onChangeStakePool } = this.props;
    this.setState({ stakePool });
    onChangeStakePool && onChangeStakePool(stakePool);
  }

  onChangeAccount(account) {
    const { onChangeAccount } = this.props;
    this.setState({ account });
    onChangeAccount && onChangeAccount(account);
  }

  onIncrementNumTickets() {
    this.setState({ numTicketsToBuy: this.state.numTicketsToBuy + 1 });
  }

  onDecrementNumTickets() {
    const { numTicketsToBuy } = this.state;
    this.setState({
      numTicketsToBuy: (numTicketsToBuy <= 1) ? 1 : (numTicketsToBuy - 1)
    });
  }

  getIsValid() {
    if (!this.getCanAffordTickets()) return false;
    if (Object.keys(this.getErrors()).length > 0) return false;
    return true;
  }

  onRequestPassphrase() {
    const { onRequestPassphrase } = this.props;
    if (!this.getIsValid()) return;
    onRequestPassphrase && onRequestPassphrase(
      "Enter Passphrase to Purchase Tickets",
      null,
      this.onPurchaseTickets
    );
  }

  onPurchaseTickets(privpass) {
    const { onPurchaseTickets, onCancelPassphraseRequest } = this.props;
    if (!this.getIsValid() || !privpass) return;
    onPurchaseTickets && onPurchaseTickets(
      privpass,
      this.getAccount().value,
      this.getAccount().spendable,
      this.state.conf,
      this.state.numTicketsToBuy,
      this.state.expiry,
      this.state.ticketFee,
      this.state.txFee,
      this.getStakePool().value
    );
    onCancelPassphraseRequest && onCancelPassphraseRequest();
  }

  onChangeTicketFee(ticketFee) {
    this.setState({ ticketFee: ticketFee.replace(/[^\d.]/g, "") });
  }

  onChangeTxFee(txFee) {
    this.setState({ txFee: txFee.replace(/[^\d.]/g, "") });
  }

  onChangeExpiry(expiry) {
    this.setState({ expiry: expiry.replace(/[^\d.]/g, "") });
  }

  getErrors() {
    const { ticketFee, txFee, expiry } = this.state;
    const errors = {
      ticketFeeError: (isNaN(ticketFee) || ticketFee <= 0 || ticketFee >= 1)
        ? "*Invalid ticket fee (0 - 1 DCR/KB)"
        : null,
      txFeeError: (isNaN(txFee) || txFee <= 0 || txFee >= 1)
        ? "*Invalid tx fee (0 - 1 DCR/KB)"
        : null,
      expiryError: (isNaN(expiry) || expiry < 0)
        ? "*Invalid expiry (>= 0)"
        : null
    };
    Object.keys(errors).forEach(key => errors[key] ? null : delete errors[key]);
    return errors;
  }
}

export default purchaseTickets(PurchaseTickets);
