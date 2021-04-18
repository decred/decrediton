import TopLevelPrivacyOptions from "./TopLevelOptions";
import { PageBody } from "layout";
import { Content } from "../helpers";

export default ({ isTestNet, ...props }) => (
  <PageBody data-testid="getstarted-pagebody" getStarted isTestnet={isTestNet}>
    <Content>
      <TopLevelPrivacyOptions {...props} />
    </Content>
  </PageBody>
);
