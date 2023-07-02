import { FormattedMessage as T } from "react-intl";

const SwitchStatusLabel = ({ performing, value }) =>
  performing || value === undefined ? (
    <T id="trezorPage.security.loading" m="loading" />
  ) : value ? (
    <T id="trezorPage.security.on" m="on" />
  ) : (
    <T id="trezorPage.security.off" m="off" />
  );

export default SwitchStatusLabel;
