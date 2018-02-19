import "style/Loading.less";

const DecredLoading = ({ hidden }) => (
  <div
    className={"new-logo-animation"}
    style={{ display: hidden ? "none" : "block" }}/>
);

export default DecredLoading;
