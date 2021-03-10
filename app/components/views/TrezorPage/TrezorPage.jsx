import { StandalonePage, StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { TREZOR_ICON } from "constants";
import TrezorPageContent from "./TrezorPageContent";

const TrezorPageHeader = () => (
  <StandaloneHeader
    iconType={TREZOR_ICON}
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
