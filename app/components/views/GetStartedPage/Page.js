import DecredLoading from "DecredLoading";
import "style/GetStarted.less";
import "style/Layout.less";

const Page = ({ Header, Body, ...props }) => {
  return (
    <div className="page-view inverted-colors">
      <Header {...props} />
      <div className="page-content-fixed">
        <DecredLoading
          hidden={!props.isProcessing || props.showSettings}
          className="get-started-loading"
        />
        <Body {...props} />
      </div>
    </div>
  );
};
export default Page;
