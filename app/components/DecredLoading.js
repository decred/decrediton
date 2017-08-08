// @flow
import React from "react";
import "../style/Loading.less";

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
