import TopLevelPrivacyOptions from "./TopLevelOptions";
import { classNames } from "pi-ui";

export default ({ isTestNet, ...props }) => (
  <div
    className={classNames("page-body getstarted", isTestNet && "testnet-body")}>
    <div className="getstarted-new">
      <TopLevelPrivacyOptions {...props} />
    </div>
  </div>
);
