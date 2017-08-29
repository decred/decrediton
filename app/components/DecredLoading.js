// @flow
import React from "react";
import { PropTypes } from "prop-types";
import "../style/Loading.less";

class DecredLoading extends React.Component {

  static propTypes = {
    hidden: PropTypes.bool
  };

  render() {
    return (
      <div className="loading" style={{display: this.props.hidden ? "none" : "block"}}>
        <div className="logo"/>
      </div>
    );
  }
}

export default DecredLoading;
