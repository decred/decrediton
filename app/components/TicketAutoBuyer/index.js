import React from "react";
import { autobind } from "core-decorators";
import ticketAutoBuyer from "../../connectors/ticketAutoBuyer";
import { substruct, compose, eq, get } from "../../fp";
import { injectIntl } from "react-intl";
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
      isHidingDetails: true,
      canNotEnableAutobuyer: false,
      balanceToMaintainError: false,
      maxFeeError: false,
      maxPriceAbsoluteError: false,
      maxPriceRelativeError: false,
      maxPerBlockError: false
    };
  }

  render() {
    return (
      <TicketAutoBuyerForm
        {...{
          isTicketAutoBuyerConfigDirty: this.getIsDirty(),
          formatMessage: this.props.intl.formatMessage,
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

  getValueInAtoms(value) {
    const { currencyDisplay } = this.props;
    if (currencyDisplay === "DCR")
      return value * 100000000;
    return value;
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
    const account = this.props.onChangeAccount ? this.props.account : this.state.account;
    return this.props.spendingAccounts.find(compose(eq(account.value), get("value")));
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
    const balanceToMaintainInAtoms = this.getValueInAtoms(balanceToMaintain);

    const balanceToMaintainError = (
      isNaN(balanceToMaintainInAtoms) ||
      balanceToMaintainInAtoms < 0
    ) || !balanceToMaintain;

    this.setState({
      balanceToMaintain: balanceToMaintain.replace(/[^\d.]/g, ""),
      balanceToMaintainError: balanceToMaintainError
    });
  }

  onChangeMaxFee(maxFee) {
    const maxFeeError = (isNaN(maxFee) || maxFee <= 0 || maxFee >= 0.1) || !maxFee;
    this.setState({
      maxFee: maxFee.replace(/[^\d.]/g, ""),
      maxFeeError: maxFeeError
    });
  }

  onChangeMaxPriceAbsolute(maxPriceAbsolute) {
    const maxPriceAbsoluteError = (isNaN(maxPriceAbsolute) || maxPriceAbsolute < 0) || !maxPriceAbsolute;
    this.setState({
      maxPriceAbsolute: maxPriceAbsolute.replace(/[^\d.]/g, ""),
      maxPriceAbsoluteError: maxPriceAbsoluteError
    });
  }

  onChangeMaxPriceRelative(maxPriceRelative) {
    const maxPriceRelativeError = (isNaN(maxPriceRelative) || maxPriceRelative < 0) || !maxPriceRelative;
    this.setState({
      maxPriceRelative: maxPriceRelative.replace(/[^\d.]/g, ""),
      maxPriceRelativeError: maxPriceRelativeError
    });
  }

  onChangeMaxPerBlock(maxPerBlock) {
    const maxPerBlockError = !maxPerBlock;
    this.setState({
      maxPerBlock: maxPerBlock.replace(/[^\d.]/g, ""),
      maxPerBlockError: maxPerBlockError
    });
  }

  onToggleTicketAutoBuyer() {
    if (this.getErrors())
      return;
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

  getErrors() {
    const { balanceToMaintainError, maxFeeError, maxPriceAbsoluteError, maxPriceRelativeError, maxPerBlockError } = this.state;

    if (balanceToMaintainError || maxFeeError || maxPriceAbsoluteError || maxPriceRelativeError || maxPerBlockError) {
      this.setState({
        canNotEnableAutobuyer: true
      });
      return true;
    }

    this.setState({
      canNotEnableAutobuyer: false
    });
    return false;
  }

}

export default ticketAutoBuyer(injectIntl(TicketAutoBuyer));
