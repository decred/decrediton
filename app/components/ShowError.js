// @flow
import React, { Component } from "react";

class ShowError extends Component {
  render() {
    const { error } = this.props;
    if (error === null) {
      return (<div></div>);
    }

    return (
      <div className="error">
        <p>{error}</p>
      </div>
    );
  }
}
export default ShowError;
