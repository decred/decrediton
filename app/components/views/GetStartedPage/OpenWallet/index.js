import React, { Component } from "react";
import { autobind } from "core-decorators";
import OpenWalletDecryptForm from "./DecryptForm";
import OpenWalletCreateForm from "./CreateForm";

@autobind
class OpenWallet extends Component {
  constructor(props)  {
    super(props);
    this.state = this.getInitialState();
  }

  componentWillUnmount() {
    this.resetState();
  }

  getInitialState() {
    return {
      publicPassPhrase: "",
      hasAttemptedOpen: false
    };
  }

  render() {
    const { publicPassPhrase, hasAttemptedOpen } = this.state;
    const { hasExistingWallet } = this.props;
    const {
      setPublicPassPhrase,
      onToggleNewExisting,
      onOpenWallet
    } = this;

    return hasExistingWallet ? (
      <OpenWalletDecryptForm
        {...{
          ...this.props,
          publicPassPhrase,
          hasAttemptedOpen,
          setPublicPassPhrase,
          onOpenWallet
        }}
      />
    ) : (
      <OpenWalletCreateForm
        {...{
          ...this.props,
          onToggleNewExisting
        }}
      />
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  onSetPublicPassPhrase(publicPassPhrase) {
    this.setState({ publicPassPhrase });
  }

  onOpenWallet() {
    if (!this.state.publicPassPhrase) {
      return this.setState({ hasAttemptedOpen: true });
    }

    this.props.onOpenWallet(this.state.publicPassPhrase);
    this.resetState();
  }

  onToggleNewExisting(side) {
    if (side == "right") {
      this.props.onSetCreateWalletFromExisting(true);
    } else if (side == "left") {
      this.props.onSetCreateWalletFromExisting(false);
    }
  }
}

export default OpenWallet;
