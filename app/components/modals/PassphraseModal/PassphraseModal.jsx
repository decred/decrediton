import Modal from "./PassphraseModalContent";
import { useState, useCallback } from "react";
import { useEffect } from "react";

const PassphraseModal = ({
  onCancelModal,
  onSubmit,
  parentIsValid,
  ...props
}) => {
  const [passPhrase, setPassPhrase] = useState(null);
  const [isValid, setIsValid] = useState(null);

  const resetState = useCallback(() => {
    setPassPhrase(null);
  }, []);

  const onCancelModalCallback = useCallback(() => {
    resetState();
    onCancelModal && onCancelModal();
  }, [resetState, onCancelModal]);

  const onSubmitCallback = useCallback(() => {
    if (!isValid) {
      return;
    }

    onSubmit(passPhrase);
    resetState();
  }, [passPhrase, onSubmit, resetState, isValid]);

  useEffect(() => setIsValid(
    // if parentIsValid is not passed as props, we consider it as true.
    (parentIsValid === undefined ? true : parentIsValid) && !!passPhrase
  ), [passPhrase, parentIsValid]);

  return (
    <Modal
      {...props}
      {...{
        passPhrase,
        onCancelModal: onCancelModalCallback,
        setPassPhrase,
        isValid,
        onSubmit: onSubmitCallback
      }}
    />
  );
};

export default PassphraseModal;
