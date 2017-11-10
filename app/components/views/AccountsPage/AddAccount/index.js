import React, { Component, } from "react";
import { autobind } from "core-decorators";
import AddAccountForm from "./Form";
import addAccountConnector from "../../../../connectors/accountsPageAddAccount";

@autobind
class AddAccount extends Component {
  constructor(props)  {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      name: "",
      passPhrase: "",
      hasAttemptedSave: false
    };
  }

  componentWillUnmount() {
    this.resetState();
  }

  render() {
    return (
      <AddAccountForm
        {...{
          name: this.state.name,
          passPhrase: this.state.passPhrase,
          hasAttemptedSave: this.state.hasAttemptedSave,
          setName: this.setName,
          setPassPhrase: this.setPassPhrase,
          onSave: this.onSave,
          onCancel: this.onCancel
        }}
      />
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  onSave() {
    const { name, passPhrase } = this.state;

    if (!name || !passPhrase) {
      return this.setState({ hasAttemptedSave: true });
    }

    this.props.onGetNextAccountAttempt(Buffer.from(passPhrase), name);
    this.props.onSave ? this.props.onSave() : null;
    this.resetState();
  }

  onCancel() {
    this.resetState();
    this.props.onCancel ? this.props.onCancel() : null;
  }

  setName(name) {
    this.setState({ name });
  }

  setPassPhrase(passPhrase) {
    this.setState({ passPhrase });
  }
}

export default addAccountConnector(AddAccount);
