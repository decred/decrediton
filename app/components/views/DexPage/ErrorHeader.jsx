import { FormattedMessage as T } from "react-intl";
import { StandaloneHeader } from "layout";
import { DEX_ICON } from "constants";

const ErrorHeader = () => (
  <StandaloneHeader
    title={<T id="dex.error.title" m="DEX Error" />}
    description={<T id="dex.error.description" m="Dex not running" />}
    iconType={DEX_ICON}
  />
);

export default ErrorHeader;
