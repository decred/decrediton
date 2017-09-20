import React, { Component } from "react";
import { autobind } from "core-decorators";
import { OpenWalletDecryptFormHeader, OpenWalletDecryptFormBody } from "./DecryptForm";
import { OpenWalletCreateFormHeader, OpenWalletCreateFormBody } from "./CreateForm";

@autobind
class OpenWalletHeader extends Component {
  render() {
    const { hasExistingWallet } = this.props;
    const { onToggleNewExisting } = this;

    return hasExistingWallet ? (
      <OpenWalletDecryptFormHeader
        {...{
          ...this.props
        }}
      />
    ) : (
      <OpenWalletCreateFormHeader
        {...{
          ...this.props,
          onToggleNewExisting
        }}
      />
    );
  }

  onToggleNewExisting(side) {
    if (side == "right") {
      this.props.onSetCreateWalletFromExisting(true);
    } else if (side == "left") {
      this.props.onSetCreateWalletFromExisting(false);
    }
  }
}

@autobind
class OpenWalletBody extends Component {
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
    const { publicPassPhrase, hasAttemptedOpen, onKeyDown } = this.state;
    const { hasExistingWallet } = this.props;
    const {
      onSetPublicPassPhrase,
      onOpenWallet
    } = this;

    return hasExistingWallet ? (
      <OpenWalletDecryptFormBody
        {...{
          ...this.props,
          publicPassPhrase,
          hasAttemptedOpen,
          onSetPublicPassPhrase,
          onOpenWallet,
          onKeyDown
        }}
      />
    ) : (
      <OpenWalletCreateFormBody
        {...{
          ...this.props
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

    this.props.onOpenWallet(this.state.publicPassPhrase, true);
    this.resetState();
  }

  onKeyDown(e) {
    if(e.keyCode == 13) {     // Enter key
      e.preventDefault();
      this.onOpenWallet();
    }
  }

}

export { OpenWalletHeader, OpenWalletBody };
