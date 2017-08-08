// @flow
import React from "react";
import { autobind } from "core-decorators";
import Loading from "./Loading";

@autobind
class DecredLoading extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Loading />
    );
  }
}

export default DecredLoading;
