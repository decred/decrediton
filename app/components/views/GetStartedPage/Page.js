import React from "react";
import SideBar from "../../SideBar";
import DecredLoading from "../../DecredLoading";
import "../../../style/GetStarted.less";
import "../../../style/Layout.less";

const Page = ({ Header, Body, ...props }) => (
  <div className="page-body">
    <SideBar gettingStarted />
    <div className="page-view">
      <Header {...props} />
      <div className="page-content-fixed">
        <DecredLoading hidden={!props.isProcessing} className="get-started-loading" />
        <Body {...props} />
      </div>
    </div>
  </div>
);

export default Page;
