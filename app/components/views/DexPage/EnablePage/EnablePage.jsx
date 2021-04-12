import { FormattedMessage as T } from "react-intl";
import { useDex } from "../hooks";
import { ResetNetworkButton } from "buttons";

export const EnablePage = () => {
  const { onEnableDex, enableDexAttempt } = useDex();

  return (
    <div>
      <T
        id="dex.enableInformation"
        m="Welcome to Decred's Decentralized Exchange! By clicking the following button you are enabling DEX on this wallet.  For security purposes, we suggest using a separate DEX wallet and then transfer funds out from there to your normal wallet."
      />
      <ResetNetworkButton
        modalTitle={
          <T id="dex.resetWalletRequired" m="Wallet reset required" />
        }
        buttonLabel={<T id="dex.enableButton" m="Enable DEX" />}
        modalContent={
          <T
            id="dex.resetWalletRequiredContent"
            m="The wallet must be restarted to be able to communicate with the DEX client.  Return to the DEX page once re-loaded and you may continue the process."
          />
        }
        disabled={enableDexAttempt}
        loading={enableDexAttempt}
        size="large"
        block={false}
        onSubmit={onEnableDex}
      />
    </div>
  );
};
