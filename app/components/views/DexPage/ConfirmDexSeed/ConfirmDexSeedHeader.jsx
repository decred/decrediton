import { FormattedMessage as T } from "react-intl";
import { DEX_ICON } from "constants";
import { StandaloneHeader } from "layout";

const ConfirmDexSeedHeader = () => (
  <StandaloneHeader
    title={<T id="dex.confirmDexSeed.title" m="Confirm DEX Account Seed" />}
    description={
      <T
        id="dex.confirmDexSeed.description"
        m="Please confirm your DEX account seed before proceeding."
      />
    }
    iconType={DEX_ICON}
  />
);

export default ConfirmDexSeedHeader;
