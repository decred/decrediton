import { compose, not, eq, get } from "fp";
import { service, settings, send } from "connectors";
import SendPage from "./Page";
import ErrorScreen from "ErrorScreen";
import { restrictToStdDecimalNumber } from "helpers/strings";
import { FormattedMessage as T } from "react-intl";

const BASE_OUTPUT = { destination: "", amountStr: "" };

@autobind
class Send extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      isShowingConfirm: false,
      isSendAll: false,
      isSendSelf: false,
      hastAttemptedConstruct: false,
      account: this.props.defaultSpendingAccount,
      outputs: [{ key: 0, ...BASE_OUTPUT }],
      outputAccount: this.props.defaultSpendingAccount,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { nextAddress } = this.props;
    const { isSendSelf, outputs } = this.state;
    if (isSendSelf && (nextAddress != nextProps.nextAddress)) {
      let newOutputs = outputs.map(o => ({...o, destination: nextProps.nextAddress}));
      this.setState({outputs: newOutputs}, this.onAttemptConstructTransaction);
    }
  }

  componentWillUnmount() {
    this.onClearTransaction();
  }

  render() {
    const {
      onChangeAccount,
      onChangeOutputAccount,
      onAttemptSignTransaction,
      onClearTransaction,
      onShowConfirm,
      onShowSendAll,
      onHideSendAll,
      onShowSendSelf,
      onShowSendOthers,
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
          onChangeOutputAccount,
          onAttemptSignTransaction,
          onClearTransaction,
          onShowConfirm,
          onShowSendAll,
          onHideSendAll,
          onShowSendSelf,
          onShowSendOthers,
          onAttemptConstructTransaction,
          onAddOutput,
          getOnRemoveOutput,
          getOnChangeOutputDestination,
          getOnChangeOutputAmount,
          getAddressError,
          getAmountError,
        }}
      />
    );
  }

  onChangeAccount(account) {
    this.setState({ account }, this.onAttemptConstructTransaction);
  }

  onAttemptSignTransaction(privpass) {
    const { unsignedTransaction, onAttemptSignTransaction,
      getNextAddressAttempt, nextAddressAccount } = this.props;
    if (!privpass || !this.getIsValid()) return;
    onAttemptSignTransaction && onAttemptSignTransaction(privpass, unsignedTransaction);
    getNextAddressAttempt && nextAddressAccount && getNextAddressAttempt(nextAddressAccount.value);
    this.onClearTransaction();
  }

  onClearTransaction() {
    this.setState(this.getInitialState(), this.props.onClearTransaction);
  }
  onShowSendAll() {
    let { outputs } = this.state;
    if (outputs.length > 1) {
      outputs = [outputs[0]];
    }
    this.setState({ isSendAll: true, outputs }, this.onAttemptConstructTransaction);
  }
  onHideSendAll() {
    let { outputs } = this.state;
    if (outputs.length > 1) {
      outputs = [{...outputs[0], amountStr: ""}];
    }
    this.setState({ isSendAll: false, outputs}, this.onAttemptConstructTransaction);
  }
  onShowConfirm() {
    if (!this.getIsValid()) return;
    this.setState({ isShowingConfirm: true });
  }
  onShowSendSelf() {
    let outputs = [{key: 0, destination: this.props.nextAddress, amountStr: ""}];
    this.setState({ isSendSelf: true, outputs }, this.onAttemptConstructTransaction);
  }
  onShowSendOthers() {
    let outputs = [{key: 0, destination: "", amountStr: ""}];
    this.setState({ isSendSelf: false, outputs }, this.onAttemptConstructTransaction);
  }

  onAttemptConstructTransaction() {
    const { onAttemptConstructTransaction, unitDivisor } = this.props;
    const confirmations = 0;
    if (this.getHasEmptyFields()) return;
    this.setState({ hastAttemptedConstruct: true });
    if (this.getIsInvalid()) return;

    if (!this.getIsSendAll()) {
      onAttemptConstructTransaction && onAttemptConstructTransaction(
        this.state.account.value,
        confirmations,
        this.state.outputs.map(({ amountStr, destination }) => ({
          destination,
          amount: parseFloat(amountStr) * unitDivisor
        }))
      );
    } else {
      onAttemptConstructTransaction && onAttemptConstructTransaction(
        this.state.account.value,
        confirmations,
        this.state.outputs.map(({ destination }) => ({
          destination,
        })),
        true
      );
    }
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
      outputs: this.state.outputs.map(o => (o.key === key) ? {
        ...o, amountStr: restrictToStdDecimalNumber(amountStr)
      } : o)
    });
  }

  getIsInvalid() {
    return !!this.state.outputs.find((o, index) => (
      this.getAddressError(index) || this.getAmountError(index)
    ));
  }

  getHasEmptyFields() {
    return !!this.state.outputs.find(({ destination, amountStr }) => !destination || (!amountStr && !this.state.isSendAll));
  }

  getIsValid() {
    return !!(
      !this.getIsInvalid() &&
      this.props.unsignedTransaction &&
      !this.props.isConstructingTransaction
    );
  }
  getIsSendAll() {
    return this.state.isSendAll;
  }
  getIsSendSelf() {
    return this.state.isSendSelf;
  }
  getAddressError(key) {
    // do some more helper address checking here
    // possibly check for Ds/Dc Ts/Tc and length at the least
    // later can do full address validtion from dcrutil code
    // (actually we should do this in selectors once state is moved to redux)
    const { outputs } = this.state;
    const { destination } = outputs[key];
    if (!destination) return <T id="send.errors.invalidAddress" m="*Please enter a valid address" />;
  }

  getAmountError(key) {
    const { outputs, isSendAll} = this.state;
    const { amountStr } = outputs[key];
    const amount = parseFloat(amountStr);
    if (isNaN(amount) && !isSendAll) return <T id="send.errors.invalidAmount" m="*Please enter a valid amount" /> ;
    if (amount <= 0 && !isSendAll) return <T id="send.errors.negativeAmount" m="*Please enter a valid amount (> 0)" />;
  }
}

export default service(settings(send(Send)));
