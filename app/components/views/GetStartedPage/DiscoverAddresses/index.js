import React, { Component } from "react";
import { autobind } from "core-decorators";
import DiscoverAddressesForm from "./Form";

@autobind
class DiscoverAddresses extends Component {
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
    const { onSetPassPhrase, onDiscoverAddresses } = this;

    return (
      <DiscoverAddressesForm
        {...{
          ...this.props,
          passPhrase,
          hasAttemptedDiscover,
          onSetPassPhrase,
          onDiscoverAddresses
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
}

export default DiscoverAddresses;
