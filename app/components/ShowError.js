// @flow
import React, { Component } from "react";

class ShowError extends Component {
  render() {
    const { error, className } = this.props;
    if (error === null) {
      return null;
    }

    return <div className={"error" + (className ? (" " + className) : "")}>{error}</div>;
  }
}
export default ShowError;
