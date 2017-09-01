import React from "react";
import SideBar from "../../SideBar";
import DecredLoading from "../../DecredLoading";
import "../../../style/GetStarted.less";

const Page = ({ Header, Body, ...props }) => (
  <div className="get-started-body">
    <SideBar gettingStarted />
    <div className="get-started-view">
      <Header {...props} />
      <div className="get-started-content">
        <DecredLoading hidden={!props.isProcessing} className="get-started-loading" />
        <Body {...props} />
      </div>
    </div>
  </div>
);

export default Page;
