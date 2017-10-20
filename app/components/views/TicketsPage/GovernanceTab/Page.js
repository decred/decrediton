import React from "react";
import TabContent from "../../../TabbedPage/TabContent";
import ReactTooltip from "react-tooltip";
import "../../../../style/Layout.less";
import "../../../../style/ReceivePage.less";
import "../../../../style/MiscComponents.less";

const GovernancePage = () => (
  <TabContent>
    <div className="receive-content-nest">
      Governance Page
    </div>
    <ReactTooltip />
  </TabContent>
);

export default GovernancePage;
