import React, { Component } from "react";
import { autobind } from "core-decorators";
import {
  DaemonLoadingFormHeader as DaemonLoadingHeader,
  DaemonLoadingFormBody
} from "./Form";

@autobind
class DaemonLoadingBody extends Component {
  constructor(props)  {
    super(props);
    this.state = this.getInitialState();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.resetState();
    if(this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  getInitialState() {
    return {
      showLongWaitMessage: false
    };
  }

  render() {
    const { showLongWaitMessage } = this.state;
    const minutesLeft = this.props.getEstimatedTimeLeft;
    let finishDateEstimation = null;
    if (minutesLeft !== null) {
      finishDateEstimation = new Date();
      finishDateEstimation.setMinutes(finishDateEstimation.getMinutes() + minutesLeft);
    }
    return (
      <DaemonLoadingFormBody
        {...{
          ...this.props,
          showLongWaitMessage,
          finishDateEstimation
        }}
      />
    );
  }

  componentDidMount() {
    this.mounted = true;
    this.timeoutId = setTimeout(() => {
      if(this.mounted) {
        this.setState({ showLongWaitMessage: true });
      }
      delete this.timeoutId;
    }, 2000);
  }

  resetState() {
    this.setState(this.getInitialState());
  }
}

export { DaemonLoadingHeader, DaemonLoadingBody };
