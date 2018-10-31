import TopLevelPrivacyOptions from "./TopLevelOptions";
import CustomPrivacyOptions from "./CustomPrivacyOptions";

export default ({ showCustomPrivacy, ...props }) => (
  <div className="page-body getstarted">
    <div className="getstarted-new">
      {!showCustomPrivacy
        ? <TopLevelPrivacyOptions {...props} />
        : <CustomPrivacyOptions {...props} />}
    </div>
  </div>
);
