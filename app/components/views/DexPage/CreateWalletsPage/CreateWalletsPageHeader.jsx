import { FormattedMessage as T } from "react-intl";
import { DEX_ICON } from "constants";
import { StandaloneHeader } from "layout";

const CreateWalletPageHeader = () => (
  <StandaloneHeader
    title={<T id="dex.createWallet.title" m="Connect Wallets to Dex" />}
    description={
      <T
        id="dex.createWallet.description"
        m={
          "Complete the following steps to connect your DCR and BTC wallets to the DEX."
        }
      />
    }
    iconType={DEX_ICON}
  />
);

export default CreateWalletPageHeader;
