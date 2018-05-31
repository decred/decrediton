import { FormattedMessage as T } from "react-intl";
import { StandalonePage, StandaloneHeader } from "layout";
import { default as SignTab } from "./SignMessage";
import { default as ValidateAddressTab } from "./ValidateAddress";
import { default as VerifyMessageTab } from "./VerifyMessage";

const SecurityHeader = () =>
  <StandaloneHeader
    iconClassName="security"
    title={<T id="security.title" m="Security Center" />}
    description={<T id="security.description" m="Various tools that help in different aspects of crypto currency security will be located here." />}
  />;

export default () => (
  <StandalonePage header={<SecurityHeader />}>
    <SignTab />
    <VerifyMessageTab />
    <ValidateAddressTab />
  </StandalonePage>
);
