import React from "react";
import "../style/Loading.less";

const DecredLoading = ({ hidden, className }) => (
  <div
    className={"loading" + (className ? (" " + className) : "")}
    style={{display: hidden ? "none" : "block"}}>
    <div className="logo"/>
  </div>
);

export default DecredLoading;
