import { FormattedMessage as T } from "react-intl";
import { StandaloneHeader } from "layout";

export default () =>
  <StandaloneHeader
    iconClassName="trezor"
    title={<T id="trezorPage.title" m="Trezor Setup" />}
    description={<T id="trezorPage.description" m="Perform several trezor-related actions." />}
  />;
