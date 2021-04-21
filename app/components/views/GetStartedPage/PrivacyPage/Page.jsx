import TopLevelPrivacyOptions from "./TopLevelOptions";
import CustomPrivacyOptions from "./CustomPrivacyOptions";
import { PageBody } from "layout";
import { Content } from "../helpers";

export default ({ showCustomPrivacy, isTestNet, ...props }) => (
  <PageBody data-testid="getstarted-pagebody" getStarted isTestNet={isTestNet}>
    <Content>
      {!showCustomPrivacy ? (
        <TopLevelPrivacyOptions {...props} />
      ) : (
        <CustomPrivacyOptions {...props} />
      )}
    </Content>
  </PageBody>
);
