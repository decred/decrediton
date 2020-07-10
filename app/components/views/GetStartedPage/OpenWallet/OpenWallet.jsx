import { useState, useCallback } from "react";
import OpenWalletDecryptFormBody from "./DecryptForm";
import { FormattedMessage as T } from "react-intl";
import { OPENWALLET_FAILED_INPUT } from "actions/WalletLoaderActions";

const OpenWallet = ({ onOpenWallet, onSendContinue, onSendError }) => {
  const [publicPassPhrase, setPublicPassPhrase] = useState("");

  const onOpenWalletHandler = useCallback(() => {
    if (publicPassPhrase == "") {
      return;
    }
    onOpenWallet(publicPassPhrase, true)
      .then(() => onSendContinue())
      .catch((error) => {
        if (error === OPENWALLET_FAILED_INPUT) {
          return onSendError(
            <T
              id="getStarted.decrypt.error"
              m="Wrong public passphrase inserted."
            />
          );
        }
        onSendError(error);
      })
      .finally(() => setPublicPassPhrase(""));
  }, [onOpenWallet, onSendContinue, onSendError, publicPassPhrase]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.keyCode == 13) {
        e.preventDefault();
        onOpenWalletHandler();
      }
    },
    [onOpenWalletHandler]
  );

  return (
    <OpenWalletDecryptFormBody
      {...{
        publicPassPhrase,
        onSetPublicPassPhrase: setPublicPassPhrase,
        onOpenWallet: onOpenWalletHandler,
        onKeyDown
      }}
    />
  );
};

export default OpenWallet;
