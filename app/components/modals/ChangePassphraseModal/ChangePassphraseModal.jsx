import Modal from "./ChangePassphraseModalContent";
import { useEffect, useState, useCallback } from "react";
import { FormattedMessage as T } from "react-intl";

const ChangePassphraseModal = ({ onCancelModal, onSubmit, ...props }) => {
  const [newPassphrase, setNewPassphrase] = useState("");
  const [confirmPrivPass, setConfirmPrivPass] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setIsError] = useState("");

  const resetState = useCallback(() => {
    setNewPassphrase("");
    setConfirmPrivPass("");
  }, []);

  const onCancelModalCallback = useCallback(() => {
    resetState();
    onCancelModal && onCancelModal();
  }, [resetState, onCancelModal]);

  const onSubmitCallback = useCallback((passPhrase) => {
    onSubmit(passPhrase, newPassphrase, true);
    resetState();
  }, [newPassphrase, onSubmit, resetState]);

  useEffect(() => {
    setIsValid(!!newPassphrase &&
      newPassphrase === confirmPrivPass);
  }, [newPassphrase, confirmPrivPass]);

  useEffect(() => {
    if (isValid) {
      setIsError(null);
      return;
    }
    if (!newPassphrase) {
      const error = <T id="error.empty.fields" m="Fill all fields." />;
      setIsError(error);
      return;
    }
    if (newPassphrase !== confirmPrivPass) {
      const error = <T id="error.not.same.pass" m="Passwords does not match." />;
      setIsError(error);
      return;
    }
  }, [isValid, newPassphrase, confirmPrivPass]);

  return (
    <Modal
      {...props}
      {...{
        newPassphrase,
        confirmPrivPass,
        onCancelModal: onCancelModalCallback,
        isValid,
        onSubmit: onSubmitCallback,
        setNewPassphrase,
        setConfirmPrivPass,
        error
      }}
    />
  );
};

export default ChangePassphraseModal;
