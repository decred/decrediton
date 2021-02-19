import Modal from "./AppPassAndPassphraseModalContent";
import { useEffect, useState, useCallback } from "react";
import { FormattedMessage as T } from "react-intl";

const AppPassAndPassphraseModal = ({ onCancelModal, onSubmit, ...props }) => {
  const [appPassphrase, setAppPassphrase] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [error, setIsError] = useState("");

  const resetState = useCallback(() => {
    setAppPassphrase(null);
  }, []);

  const onCancelModalCallback = useCallback(() => {
    resetState();
    onCancelModal && onCancelModal();
  }, [resetState, onCancelModal]);

  const onSubmitCallback = useCallback(
    (passPhrase) => {
      onSubmit(passPhrase, { appPassphrase });
      resetState();
    },
    [appPassphrase, onSubmit, resetState]
  );

  useEffect(() => {
    setIsValid(!!appPassphrase);
  }, [appPassphrase]);

  useEffect(() => {
    if (appPassphrase === null) {
      return;
    }
    if (isValid) {
      setIsError(null);
      return;
    }
    if (!appPassphrase) {
      const error = <T id="error.empty.fields" m="Fill all fields." />;
      setIsError(error);
      return;
    }
  }, [isValid, appPassphrase]);

  return (
    <Modal
      {...props}
      {...{
        appPassphrase,
        onCancelModal: onCancelModalCallback,
        isValid,
        onSubmit: onSubmitCallback,
        setAppPassphrase,
        error
      }}
    />
  );
};

export default AppPassAndPassphraseModal;
