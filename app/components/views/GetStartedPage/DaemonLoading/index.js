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
    return {};
  }

  render() {
    return (
      <DaemonLoadingFormBody
        {...{
          ...this.props,
        }}
      />
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }
}

export { DaemonLoadingHeader, DaemonLoadingBody };
