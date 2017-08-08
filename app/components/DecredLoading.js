// @flow
import React from "react";
import { autobind } from "core-decorators";
import "../style/Loading.less";

@autobind
class DecredLoading extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="loading">
        <div className="logo"/>
      </div>
    );
  }
}

export default DecredLoading;
