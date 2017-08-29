// @flow
import React, { Component } from "react";
import { autobind } from "core-decorators";
import { connect } from "react-redux";

@autobind
class DaemonLoader extends Component {
  componentDidMount() {
    console.log("waiting for daemon");
  }

  render() {
    return (
    <div>
      Loading Daemon
    </div>);
  }
}

export default connect(DaemonLoader);
