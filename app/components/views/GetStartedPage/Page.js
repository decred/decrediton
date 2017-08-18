import React from "react";
import Radium from "radium";
import SideBar from "../../SideBar";
import { GetStartedStyles } from "../ViewStyles";

const Page = ({ children }) => (
  <div style={GetStartedStyles.body}>
    <SideBar gettingStarted />
    <div style={GetStartedStyles.view}>{children}</div>
  </div>
);

export default Radium(Page);
