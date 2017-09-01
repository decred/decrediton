import React, { Component } from "react";
import {
  FetchBlockHeadersFormHeader as FetchBlockHeadersHeader,
  FetchBlockHeadersFormBody
} from "./Form";

class FetchBlockHeadersBody extends Component {

  constructor(props)  {
    super(props);
    this.state = this.getInitialState();
  }

  componentWillUnmount() {
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

    return (
      <FetchBlockHeadersFormBody
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

export { FetchBlockHeadersHeader, FetchBlockHeadersBody };
