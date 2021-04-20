import { FormattedMessage as T } from "react-intl";
import { StandaloneHeader } from "layout";
import { DEX_ICON } from "constants";

const RegisterPageHeader = () => (
  <StandaloneHeader
    title={<T id="dex.registerPage.title" m="DEX Server Payment" />}
    description={
      <T
        id="dex.registerPage.description"
        m="Register your wallet with the DEX Server"
      />
    }
    iconType={DEX_ICON}
  />
);

export default RegisterPageHeader;
