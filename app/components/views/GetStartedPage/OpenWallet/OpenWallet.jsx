import { useState, useCallback } from "react";
import OpenWalletDecryptFormBody from "./DecryptForm";
import { FormattedMessage as T } from "react-intl";
import { OPENWALLET_FAILED_INPUT, OPENWALLET_INPUTPRIVPASS } from "actions/WalletLoaderActions";

const OpenWallet = ({ onOpenWallet, onSendContinue, onSendError, onSendDiscoverAccountsPassInput }) => {
  const [publicPassPhrase, setPublicPassPhrase] = useState("");

  const onOpenWalletHandler = useCallback(() => {
    if (publicPassPhrase == "") {
      return;
    }
    onOpenWallet(publicPassPhrase, true)
      .then(() => {
        setPublicPassPhrase("");
        onSendContinue();
      })
      .catch((error) => {
        setPublicPassPhrase("");
        if (error === OPENWALLET_INPUTPRIVPASS) {
          onSendError(null);
          return onSendDiscoverAccountsPassInput();
        }

        if (error === OPENWALLET_FAILED_INPUT) {
          return onSendError(
            <T
              id="getStarted.decrypt.error"
              m="Wrong public passphrase inserted."
            />
          );
        }
        onSendError(error);
      });
  }, [onOpenWallet, onSendContinue, onSendError, publicPassPhrase, onSendDiscoverAccountsPassInput]);

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
