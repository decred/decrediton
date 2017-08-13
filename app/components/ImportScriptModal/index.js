// @flow
import React from "react";
import { autobind } from "core-decorators";
import Modal from "./Modal";

@autobind
class ImportScriptModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  componentWillUnmount() {
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      script: "",
      passPhrase: "",
      hasFailedAttempt: false
    };
  }

  render() {
    const {
      hidden,
      heading,
      description
    } = this.props;
    const {
      passPhrase,
      script,
      hasFailedAttempt
    } = this.state;
    const {
      setScript,
      setPassPhrase,
      onSubmit,
      onCancel
    } = this;

    return (
      <Modal
        {...{
          hidden,
          heading,
          description,
          passPhrase,
          script,
          hasFailedAttempt,
          setScript,
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

  setPassPhrase(passPhrase) {
    this.setState({ passPhrase });
  }

  setScript(script) {
    this.setState({ script });
  }

  onSubmit() {
    const { passPhrase, script } = this.state;

    if (!passPhrase || !script) {
      return this.setState({ hasFailedAttempt: true });
    }

    this.props.submitImportScript(passPhrase, script);
    this.resetState();
  }

  onCancel() {
    this.resetState();
    this.props.cancelImportScript();
  }
}

export default ImportScriptModal;
