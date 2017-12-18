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
    if (!this.state.passPhrase) {
      return this.setState({ hasAttemptedDiscover: true });
    }

    this.props.onDiscoverAddresses(this.state.passPhrase);
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
