import { FormattedMessage as T } from "react-intl";
import { useDex } from "../hooks";
import { SetNewPassphraseModalButton } from "buttons";

const InitPage = () => {
  const { onInitDex, initDexAttempt } = useDex();

  return (
    <div>
      <T
        id="dex.newPassphrase"
        m="Please set a new passphrase for the DEX.  You may use the same passphrase as you use for your wallet, or chose a new one.  ** Note ** If you lose the DEX passphrase, you will be forced to create a new DEX account and pay your exchange fees again."
      />
      <SetNewPassphraseModalButton
        disabled={initDexAttempt}
        modalTitle={<T id="dex.initPassphrase" m="Set Dex Passphrase" />}
        loading={initDexAttempt}
        onSubmit={onInitDex}
        buttonLabel={<T id="dex.initPassphraseButton" m="Set Dex Passphrase" />}
      />
    </div>
  );
};

export default InitPage;
