import { StandalonePage, StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import TrezorPageContent from "./TrezorPageContent";

const TrezorPageHeader = () => (
  <StandaloneHeader
    iconClassName={"trezor"}
    title={<T id="trezorPage.title" m="Trezor" />}
    description={
      <T id="trezorPage.description" m="Manage your Trezor device." />
    }
  />
);

const TrezorPage = () => (
  <StandalonePage header={<TrezorPageHeader />}>
    <TrezorPageContent />
  </StandalonePage>
);

export default TrezorPage;
