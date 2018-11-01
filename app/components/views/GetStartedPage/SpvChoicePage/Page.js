import TopLevelPrivacyOptions from "./TopLevelOptions";

export default ({ ...props }) => (
  <div className="page-body getstarted">
    <div className="getstarted-new">
      <TopLevelPrivacyOptions {...props} />
    </div>
  </div>
);
