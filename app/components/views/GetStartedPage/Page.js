import React from "react";
import SideBar from "../../SideBar";
import "../../../style/GetStarted.less";

const Page = ({ children }) => (
  <div className="get-started-body">
    <SideBar gettingStarted />
    <div className="get-started-view">{children}</div>
  </div>
);

export default Page;
