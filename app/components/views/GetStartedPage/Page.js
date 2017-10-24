import React from "react";
import DecredLoading from "../../DecredLoading";
import "../../../style/GetStarted.less";
import "../../../style/Layout.less";

const Page = ({ Header, Body, ...props }) => {
  const { isAdvancedDaemon, isSubmited, hasErrors} = props;
  return (
    <div className="page-view inverted-colors">
      <Header {...props} />
      <div className="page-content-fixed">
        {
          isAdvancedDaemon ? 
            isSubmited && !hasErrors ? <DecredLoading hidden={!props.isProcessing} className="get-started-loading" /> : null 
            : <DecredLoading hidden={!props.isProcessing} className="get-started-loading" />
        }
        <Body {...props} />
      </div>
    </div>
  );
}
export default Page;
