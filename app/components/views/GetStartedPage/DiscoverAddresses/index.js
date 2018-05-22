import {
  DiscoverAddressesFormHeader as DiscoverAddressesHeader,
  DiscoverAddressesFormBody
} from "./Form";

@autobind
class DiscoverAddressesBody extends React.Component {
  constructor(props)  {
    super(props);
    this.state = this.getInitialState();
  }

  componentWillUnmount() {
    this.resetState();
  }

  componentDidMount() {
    if (this.props.walletPrivatePassphrase) {
      this.props.onDiscoverAddresses(this.props.walletPrivatePassphrase);
    }
  }

  getInitialState() {
    return {
      passPhrase: "",
      hasAttemptedDiscover: false
    };
  }

  render() {
    const { passPhrase, hasAttemptedDiscover } = this.state;
    const { onSetPassPhrase, onDiscoverAddresses, onKeyDown } = this;

    return (
      <DiscoverAddressesFormBody
        {...{
          ...this.props,
          passPhrase,
          hasAttemptedDiscover,
          onSetPassPhrase,
          onDiscoverAddresses,
          onKeyDown
        }}
      />
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  onSetPassPhrase(passPhrase) {
    this.setState({ passPhrase });
  }

  onDiscoverAddresses() {
    const { passPhrase } = this.state;

    if (!passPhrase) {
      return this.setState({ hasAttemptedDiscover: true });
    }

    const { onDiscoverAddresses, onSetWalletPrivatePassphrase } = this.props;

    onSetWalletPrivatePassphrase && onSetWalletPrivatePassphrase(passPhrase);
    onDiscoverAddresses(passPhrase);
    this.resetState();
  }

  onKeyDown(e) {
    if(e.keyCode == 13) {   // Enter key
      e.preventDefault();
      this.onDiscoverAddresses();
    }
  }

}

export { DiscoverAddressesHeader, DiscoverAddressesBody };
