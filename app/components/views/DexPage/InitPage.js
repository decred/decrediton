import { useDex } from "./hooks";
import { SetNewPassphraseModalButton } from "buttons";
import { StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { LN_ICON } from "constants";

export const InitPageContent = () => {
  const { onInitDexc, initDexcAttempt } = useDex();

  return (
    <div>
      <T
        id="dex.newPassphrase"
        m="Please set a new passphrase for the DEX.  You may use the same passphrase as you use for your wallet, or chose a new one.  ** Note ** If you lose the DEX passphrase, you will be forced to create a new DEX account and pay your exchange fees again."
      />
      <SetNewPassphraseModalButton
        disabled={initDexcAttempt}
        modalTitle={<T id="dex.initPassphrase" m="Set Dex Passphrase" />}
        loading={initDexcAttempt}
        onSubmit={onInitDexc}
        buttonLabel={<T id="dex.initPassphraseButton" m="Set Dex Passphrase" />}
      />
    </div>
  );
};

export const InitPageHeader = () => (
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
    iconType={LN_ICON}
  />
);
