import TopLevelPrivacyOptions from "./TopLevelOptions";
import CustomPrivacyOptions from "./CustomPrivacyOptions";
import { classNames } from "pi-ui";

export default ({ showCustomPrivacy, isTestNet, ...props }) => (
  <div
    className={classNames("page-body getstarted", isTestNet && "testnet-body")}>
    <div className="getstarted-new">
      {!showCustomPrivacy ? (
        <TopLevelPrivacyOptions {...props} />
      ) : (
        <CustomPrivacyOptions {...props} />
      )}
    </div>
  </div>
);
