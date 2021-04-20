import { FormattedMessage as T } from "react-intl";
import { StandaloneHeader } from "layout";
import { DEX_ICON } from "constants";

const CreateDexAcctPageHeader = () => (
  <StandaloneHeader
    title={<T id="dex.createDexAccount.title" m="Create DEX Account" />}
    description={
      <T
        id="dex.createDexAccount.description"
        m={
          "A new account is required to be created to improve security for the wallet overall."
        }
      />
    }
    iconType={DEX_ICON}
  />
);

export default CreateDexAcctPageHeader;
