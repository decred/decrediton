// @flow
import React, { Component, } from "react";
import { autobind } from "core-decorators";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getNextAccountAttempt } from "../../../../actions/ControlActions";
import AddAccountForm from "./Form";

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
    const {
      getNextAccountError: errorMsg,
      getNextAccountSuccess: successMsg
    } = this.props;
    const { setName, setPassPhrase, onSave, onCancel } = this;
    const { name, passPhrase, hasAttemptedSave } = this.state;

    return (
      <AddAccountForm
        {...{
          name,
          passPhrase,
          hasAttemptedSave,
          successMsg,
          errorMsg,
          setName,
          setPassPhrase,
          onSave,
          onCancel
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

    this.props.getNextAccountAttempt(Buffer.from(passPhrase), name);
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

const mapStateToProps = ({
  control: {
    getNextAccountSuccess,
    getNextAccountError
  }
}) => ({
  getNextAccountSuccess,
  getNextAccountError
});

const mapDispatchToProps = dispatch => bindActionCreators({ getNextAccountAttempt }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AddAccount);
