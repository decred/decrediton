import "style/Loading.less";

const DecredLoading = ({ hidden }) => (
  <div
    data-testid="decred-loading"
    className={"new-logo-animation"}
    style={{ display: hidden ? "none" : "block" }}
  />
);

export default DecredLoading;
