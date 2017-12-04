// @flow
import React from "react";
import { autobind } from "core-decorators";
import Modal from "./Modal";

@autobind
class PassphraseModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      passPhrase: "",
      hasAttemptedSubmit: false
    };
  }

  componentWillUnmount() {
    this.resetState();
  }

  render() {
    const { hidden, heading, description } = this.props;
    const { passPhrase, hasAttemptedSubmit } = this.state;
    const { setPassPhrase, onSubmit, onCancel } = this;

    return (
      <Modal
        {...{
          hidden,
          heading,
          description,
          passPhrase,
          hasAttemptedSubmit,
          setPassPhrase,
          onSubmit,
          onCancel
        }}
      />
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  onSubmit() {
    if (!this.state.passPhrase) {
      return this.setState({ hasAttemptedSubmit: true });
    }

    this.props.submitPassphrase(this.state.passPhrase);
    this.resetState();
  }

  onCancel() {
    this.props.cancelPassphrase();
    this.resetState();
  }

  setPassPhrase(passPhrase) {
    this.setState({ passPhrase });
  }
}

export default PassphraseModalContent;
