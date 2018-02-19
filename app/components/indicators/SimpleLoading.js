import "style/SimpleLoading.less";

const SimpleLoading = ({ disabled }) => (
  <div className={"spinner " + (disabled ? "disabled" : "")}>
    <div className="bounce1"></div>
    <div className="bounce2"></div>
    <div className="bounce3"></div>
  </div>
);

export default SimpleLoading;
