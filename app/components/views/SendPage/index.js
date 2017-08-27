import React, { Component } from "react";
import { autobind } from "core-decorators";
import { compose, not, eq, get } from "../../../fp";
import service from "../../../connectors/service";
import settings from "../../../connectors/settings";
import send from "../../../connectors/send";
import SendPage from "./Page";
import ErrorScreen from "../../ErrorScreen";

const BASE_OUTPUT = { destination: "", amountStr: "" };

@autobind
class Send extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      isShowingConfirm: false,
      hastAttemptedConstruct: false,
      account: this.props.defaultSpendingAccount,
      outputs: [{ key: 0, ...BASE_OUTPUT }]
    };
  }

  componentWillMount() {
    this.props.onClearConstructTxError();
    this.props.onClearPublishTxError();
    this.props.onClearSignTxError();
    this.props.onClearPublishTxSuccess();
  }

  render() {
    const {
      onChangeAccount,
      onAttemptSignTransaction,
      onClearTransaction,
      onShowConfirm,
      onAttemptConstructTransaction,
      onAddOutput,
      getOnRemoveOutput,
      getOnChangeOutputDestination,
      getOnChangeOutputAmount,
      getAddressError,
      getAmountError
    } = this;
    const isValid = this.getIsValid();

    return !this.props.walletService ? <ErrorScreen /> : (
      <SendPage
        {...{ ...this.props, ...this.state }}
        {...{
          isValid,
          onChangeAccount,
          onAttemptSignTransaction,
          onClearTransaction,
          onShowConfirm,
          onAttemptConstructTransaction,
          onAddOutput,
          getOnRemoveOutput,
          getOnChangeOutputDestination,
          getOnChangeOutputAmount,
          getAddressError,
          getAmountError
        }}
      />
    );
  }

  onChangeAccount(account) {
    this.setState({ account });
    this.onAttemptConstructTransaction();
  }

  onAttemptSignTransaction(privpass) {
    const { unsignedTransaction, onAttemptSignTransaction } = this.props;
    if (!privpass || !this.getIsValid()) return;
    onAttemptSignTransaction && onAttemptSignTransaction(privpass, unsignedTransaction);
    this.onClearTransaction();
  }

  onClearTransaction() {
    this.setState(this.getInitialState(), this.props.onClearTransaction);
  }

  onShowConfirm() {
    if (!this.getIsValid()) return;
    this.setState({ isShowingConfirm: true });
  }

  onAttemptConstructTransaction() {
    const { onAttemptConstructTransaction, unitDivisor } = this.props;
    const confirmations = 0;
    if (this.getHasEmptyFields()) return;
    this.setState({ hastAttemptedConstruct: true });
    if (this.getIsInvalid()) return;

    onAttemptConstructTransaction && onAttemptConstructTransaction(
      this.state.account.value,
      confirmations,
      this.state.outputs.map(({ amountStr, destination }) => ({
        destination,
        amount: parseFloat(amountStr) * unitDivisor
      }))
    );
  }

  onAddOutput() {
    const { outputs } = this.state;
    this.setState({ outputs: [...outputs, { key: outputs.length, ...BASE_OUTPUT }] });
  }

  getOnRemoveOutput(key) {
    return () => this.setState(
      { outputs: this.state.outputs.filter(compose(not(eq(key)), get("key"))) },
      this.onAttemptConstructTransaction
    );
  }

  getOnChangeOutputDestination(key) {
    return destination => this.setState({
      outputs: this.state.outputs.map(o => (o.key === key) ? { ...o, destination } : o)
    });
  }

  getOnChangeOutputAmount(key) {
    return amountStr => this.setState({
      outputs: this.state.outputs.map(o => (o.key === key) ? { ...o, amountStr } : o)
    });
  }

  getIsInvalid() {
    return !!this.state.outputs.find((o, index) => (
      this.getAddressError(index) || this.getAmountError(index)
    ));
  }

  getHasEmptyFields() {
    return !!this.state.outputs.find(({ destination, amountStr }) => !destination || !amountStr);
  }

  getIsValid() {
    return !!(
      !this.getIsInvalid() &&
      this.props.unsignedTransaction &&
      !this.props.isConstructingTransaction
    );
  }

  getAddressError(key) {
    // do some more helper address checking here
    // possibly check for Ds/Dc Ts/Tc and length at the least
    // later can do full address validtion from dcrutil code
    // (actually we should do this in selectors once state is moved to redux)
    const { outputs } = this.state;
    const { destination } = outputs[key];
    if (!destination) return "* Please enter a valid address";
  }

  getAmountError(key) {
    const { outputs } = this.state;
    const { amountStr } = outputs[key];
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) return "*Please enter a valid amount";
    if (amount <= 0) return "*Please enter a valid amount (> 0)";
  }
}

export default service(settings(send(Send)));
