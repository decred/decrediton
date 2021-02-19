import { useState, useCallback } from "react";
import PassphraseForm from "./PassphraseForm";

const DiscoverAccounts = ({ onSendSetPassphrase }) => {
  const [passPhrase, setPassPhrase] = useState("");

  const onContinueHandler = useCallback(() => {
    if (passPhrase == "") {
      return;
    }

    onSendSetPassphrase(passPhrase);
  }, [onSendSetPassphrase, passPhrase]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.keyCode == 13) {
        e.preventDefault();
        onContinueHandler();
      }
    },
    [onContinueHandler]
  );

  return (
    <PassphraseForm
      {...{
        passPhrase,
        onSetPassPhrase: setPassPhrase,
        onOpenWallet: onContinueHandler,
        onKeyDown
      }}
    />
  );
};

export default DiscoverAccounts;
