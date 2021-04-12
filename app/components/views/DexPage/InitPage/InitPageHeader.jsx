import { FormattedMessage as T } from "react-intl";
import { DEX_ICON } from "constants";
import { StandaloneHeader } from "layout";

const InitPageHeader = () => (
  <StandaloneHeader
    title={<T id="dex.initPage.title" m="Set DEX Password" />}
    description={
      <T
        id="dex.initPage.description"
        m={
          "You must create a new passphrase that will be used to log into the DEX for this wallet."
        }
      />
    }
    iconType={DEX_ICON}
  />
);

export default InitPageHeader;
