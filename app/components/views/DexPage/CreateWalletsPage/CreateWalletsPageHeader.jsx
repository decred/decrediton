import { FormattedMessage as T } from "react-intl";
import { DEX_ICON } from "constants";
import { StandaloneHeader } from "layout";

const CreateWalletPageHeader = () => (
  <StandaloneHeader
    title={<T id="dex.createWallet.title" m="Connect DCR Wallet to DEX" />}
    description={
      <T
        id="dex.createWallet.description"
        m={"Connect your DCR wallet to the DEX."}
      />
    }
    iconType={DEX_ICON}
  />
);

export default CreateWalletPageHeader;
