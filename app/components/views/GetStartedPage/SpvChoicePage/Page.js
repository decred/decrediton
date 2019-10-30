import TopLevelPrivacyOptions from "./TopLevelOptions";
import cx from "classnames";

export default ({ isTestNet, ...props }) => (
  <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
    <div className="getstarted-new">
      <TopLevelPrivacyOptions {...props} />
    </div>
  </div>
);
