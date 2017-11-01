import DecredLoading from "DecredLoading";
import "style/GetStarted.less";
import "style/Layout.less";

const Page = ({ Header, Body, ...props }) => {
  console.log(props.isProcessing, !props.isInputRequest && !props.startupError );
  return (
    <div className="page-view inverted-colors">
      <Header {...props} />
      <div className="page-content-fixed">
        <DecredLoading
          hidden={!props.isProcessing}
          className="get-started-loading"
        />
        <Body {...props} />
      </div>
    </div>
  );
};
export default Page;
