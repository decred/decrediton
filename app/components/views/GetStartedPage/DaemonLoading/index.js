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
    this.resetState();
  }

  getInitialState() {
    return {
      showLongWaitMessage: false
    };
  }

  render() {
    const { showLongWaitMessage } = this.state;
    return (
      <DaemonLoadingFormBody
        {...{
          ...this.props,
          showLongWaitMessage
        }}
      />
    );
  }

  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.setState({ showLongWaitMessage: true });
      delete this.timeoutId;
    }, 2000);
  }

  resetState() {
    this.setState(this.getInitialState());
  }
}

export { DaemonLoadingHeader, DaemonLoadingBody };
