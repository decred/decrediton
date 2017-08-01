// @flow
import React, { Component } from "react";
import { Link } from "react-router";

class ErrorScreen extends Component {
  render() {
    const errorView = (
      <div>
        <p> Something went wrong, please go back </p>
        <Link to='/'>Back home</Link>
      </div>);
    return (errorView);
  }
}
export default ErrorScreen;
