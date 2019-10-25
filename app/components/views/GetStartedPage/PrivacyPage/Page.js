import TopLevelPrivacyOptions from "./TopLevelOptions";
import CustomPrivacyOptions from "./CustomPrivacyOptions";
import cx from "classnames";

export default ({ showCustomPrivacy, isTestNet, ...props }) => (
  <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
    <div className="getstarted-new">
      {!showCustomPrivacy
        ? <TopLevelPrivacyOptions {...props} />
        : <CustomPrivacyOptions {...props} />}
    </div>
  </div>
);
