import React from "react";
import { autobind } from "core-decorators";
import ticketAutoBuyer from "../../connectors/ticketAutoBuyer";
import { substruct } from "../../fp";
import TicketAutoBuyerForm from "./Form";

@autobind
class TicketAutoBuyer extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      ...this.getCurrentSettings(),
      isHidingDetails: true
    };
  }

  render() {
    return (
      <TicketAutoBuyerForm
        {...{
          isTicketAutoBuyerConfigDirty: this.getIsDirty(),
          ...this.getInputErrors(),
          ...this.props,
          ...this.state,
          ...substruct({
            onToggleTicketAutoBuyer: null,
            onChangeBalanceToMaintain: null,
            onChangeMaxFee: null,
            onChangeMaxPriceAbsolute: null,
            onChangeMaxPriceRelative: null,
            onChangeMaxPerBlock: null,
            onUpdateTicketAutoBuyerConfig: null,
            onToggleShowDetails: null
          }, this)
        }}
      />
    );
  }

  getInputErrors() {
    return Object.keys(this.getCurrentSettings()).reduce(
      (errors, key) =>
        (isNaN(this.state[key]) || this.state[key] < 0)
          ? { ...errors, [`${key}Error`]: "Please enter a valid value (> 0)" }
          : errors,
      {}
    );
  }

  getCurrentSettings() {
    return substruct({
      balanceToMaintain: null,
      maxFee: null,
      maxPriceAbsolute: null,
      maxPriceRelative: null,
      maxPerBlock: null
    }, this.props);
  }

  getIsDirty() {
    const settings = this.getCurrentSettings();
    return !!Object.keys(settings).find(key => this.state[key] !== settings[key]);
  }

  getAccount() {
    return this.props.onChangeAccount ? this.props.account : this.state.account;
  }

  onToggleShowDetails() {
    this.state.isHidingDetails ? this.onShowDetails() : this.onHideDetails();
  }

  onShowDetails() {
    this.setState({ isHidingDetails: false });
  }

  onHideDetails() {
    this.setState({ isHidingDetails: true });
  }

  onChangeBalanceToMaintain(balanceToMaintain) {
    this.setState({ balanceToMaintain: balanceToMaintain.replace(/[^\d.]/g, "") });
  }

  onChangeMaxFee(maxFee) {
    this.setState({ maxFee: maxFee.replace(/[^\d.]/g, "") });
  }

  onChangeMaxPriceAbsolute(maxPriceAbsolute) {
    this.setState({ maxPriceAbsolute: maxPriceAbsolute.replace(/[^\d.]/g, "") });
  }

  onChangeMaxPriceRelative(maxPriceRelative) {
    this.setState({ maxPriceRelative: maxPriceRelative.replace(/[^\d.]/g, "") });
  }

  onChangeMaxPerBlock(maxPerBlock) {
    this.setState({ maxPerBlock: maxPerBlock.replace(/[^\d.]/g, "") });
  }

  onToggleTicketAutoBuyer() {
    return this.props.isTicketAutoBuyerEnabled
      ? this.props.onDisableTicketAutoBuyer()
      : this.onRequestPassphrase();
  }

  onRequestPassphrase() {
    const { onRequestPassphrase } = this.props;
    onRequestPassphrase && onRequestPassphrase(
      "Enter Passphrase to Start Autobuyer",
      null,
      this.onStartAutoBuyer
    );
  }

  onStartAutoBuyer(passphrase) {
    const { onEnableTicketAutoBuyer, onCancelPassphraseRequest } = this.props;
    onEnableTicketAutoBuyer && onEnableTicketAutoBuyer(
      passphrase,
      this.getAccount().value,
      this.state.balanceToMaintain,
      this.state.maxFee,
      this.state.maxPriceRelative,
      this.state.maxPriceAbsolute,
      this.state.maxPerBlock,
      this.props.stakePool.value
    );
    onCancelPassphraseRequest && onCancelPassphraseRequest();
  }

  onUpdateTicketAutoBuyerConfig() {
    const { onUpdateTicketAutoBuyerConfig: onUpdateConfig } = this.props;
    this.getIsDirty() ? (onUpdateConfig && onUpdateConfig(
      this.getAccount().value,
      this.state.balanceToMaintain,
      this.state.maxFee,
      this.state.maxPriceAbsolute,
      this.state.maxPriceRelative,
      this.props.stakePool.value,
      this.state.maxPerBlock
    )) : null;
  }
}

export default ticketAutoBuyer(TicketAutoBuyer);
