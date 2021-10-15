import { StandalonePage, StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { TREZOR_ICON } from "constants";
import TrezorPageContent from "./TrezorPageContent";
import TrezorPageSection from "./TrezorPageSection";

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
    <TrezorPageContent ContainerComponent={TrezorPageSection} />
  </StandalonePage>
);

export default TrezorPage;
