import React from "react";
import "style/Loading.less";

const DecredLoading = ({ hidden, className }) => (
  <div
    className={"new-logo-animation"}
    style={{display: hidden ? "none" : "block"}}/>
);

export default DecredLoading;
