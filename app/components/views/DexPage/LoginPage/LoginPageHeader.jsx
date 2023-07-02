import { FormattedMessage as T } from "react-intl";
import { DEX_ICON } from "constants";
import { StandaloneHeader } from "layout";

const LoginPageHeader = () => (
  <StandaloneHeader
    title={<T id="dex.loginPage.title" m="DEX Login" />}
    description={
      <T id="dex.loginPage.description" m="Login and connect wallet to DEX" />
    }
    iconType={DEX_ICON}
  />
);

export default LoginPageHeader;
