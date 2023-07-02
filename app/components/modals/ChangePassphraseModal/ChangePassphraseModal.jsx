import Modal from "./ChangePassphraseModalContent";
import { useEffect, useState, useCallback } from "react";
import { FormattedMessage as T } from "react-intl";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import * as sel from "selectors";

const ChangePassphraseModal = ({ onCancelModal, onSubmit, ...props }) => {
  const [newPassphrase, setNewPassphrase] = useState(null);
  const [confirmPrivPass, setConfirmPrivPass] = useState(null);
  const [dexAppPassword, setDexAppPassword] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [error, setIsError] = useState("");
  const intl = useIntl();
  const dexActive = useSelector(sel.dexActive);
  const dexAccountName = useSelector(sel.dexAccount());

  const resetState = useCallback(() => {
    setNewPassphrase(null);
    setConfirmPrivPass(null);
    setDexAppPassword(null);
  }, []);

  const onCancelModalCallback = useCallback(() => {
    resetState();
    onCancelModal && onCancelModal();
  }, [resetState, onCancelModal]);

  const onSubmitCallback = useCallback(
    (passPhrase) => {
      onSubmit(passPhrase, { newPassphrase, priv: true, dexAppPassword });
      resetState();
    },
    [newPassphrase, onSubmit, resetState, dexAppPassword]
  );

  useEffect(() => {
    setIsValid(!!newPassphrase && newPassphrase === confirmPrivPass);
  }, [newPassphrase, confirmPrivPass]);

  useEffect(() => {
    if (newPassphrase === null || confirmPrivPass === null) {
      return;
    }
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
      const error = (
        <T id="error.not.same.pass" m="Passwords does not match." />
      );
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
        dexAppPassword,
        setDexAppPassword,
        dexActive,
        dexAccountName,
        error,
        intl
      }}
    />
  );
};

export default ChangePassphraseModal;
