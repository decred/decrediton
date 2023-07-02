import { useCallback, useEffect, useState, useMemo } from "react";
import { FormattedMessage as T } from "react-intl";
import Modal from "../Modal";
import { PasswordInput, PassphraseModalField } from "inputs";
import { Documentation, ButtonsToolbar } from "shared";
import { classNames } from "pi-ui";
import styles from "./TrezorModals.module.css";

const TrezorWalletCreationPassphraseModal = ({
  isGetStarted,
  deviceLabel,
  onCancelModal,
  onSubmitPassPhrase
}) => {
  const [passphraseValue, setPassphraseValue] = useState("");
  const [passphraseConfirmValue, setPassphraseConfirmValue] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [, setMismatchedValues] = useState(false);

  useEffect(
    () => () => {
      setPassphraseValue("");
      setPassphraseConfirmValue("");
    },
    []
  );

  const onSubmit = useCallback(() => {
    if (passphraseValue != passphraseConfirmValue) {
      setSubmitAttempted(true);
      setMismatchedValues(true);
      return;
    }

    onSubmitPassPhrase(passphraseValue);
    setPassphraseValue("");
    setPassphraseConfirmValue("");
  }, [passphraseValue, passphraseConfirmValue, onSubmitPassPhrase]);

  const onChangePassphraseValue = useCallback((passphraseValue) => {
    setPassphraseValue(passphraseValue);
    setSubmitAttempted(false);
    setMismatchedValues(false);
  }, []);

  const onChangePassphraseConfirmValue = useCallback(
    (passphraseConfirmValue) => {
      setPassphraseConfirmValue(passphraseConfirmValue);
      setSubmitAttempted(false);
      setMismatchedValues(false);
    },
    []
  );

  const isValid = useMemo(
    () => passphraseValue === passphraseConfirmValue,
    [passphraseValue, passphraseConfirmValue]
  );

  return (
    <Modal
      className={classNames(
        styles.passphraseModal,
        isGetStarted && styles.getStarted
      )}
      onCancelModal={onCancelModal}>
      <h1>
        <T
          id="trezor.walletCreationPassPhraseModal.title"
          m="Type Wallet Creation PassPhrase"
        />
      </h1>
      <p>
        <T
          id="trezor.walletCreationpassphraseModal.description"
          m={
            "Type the secret passphrase of the wallet to restore from the trezor device {label}"
          }
          values={{
            label: <span className={styles.label}>'{deviceLabel}'</span>
          }}
        />
      </p>
      <Documentation name="TrezorWalletCreationPassPhraseWarning" />
      <PassphraseModalField
        label={
          <T id="trezor.walltCreationPrivatePassphrase" m="Wallet PassPhrase" />
        }>
        <PasswordInput
          id="passphraseValueInput"
          autoFocus
          placeholder=""
          value={passphraseValue}
          onChange={(e) => onChangePassphraseValue(e.target.value)}
          onKeyDownSubmit={onSubmit}
          showErrors={submitAttempted}
        />
      </PassphraseModalField>
      <PassphraseModalField
        label={
          <T
            id="trezor.walltCreationPrivatePassphraseConfirm"
            m="Confirm Wallet PassPhrase"
          />
        }>
        <PasswordInput
          id="passphraseConfirmValueInput"
          placeholder=""
          value={passphraseConfirmValue}
          onChange={(e) => onChangePassphraseConfirmValue(e.target.value)}
          onKeyDownSubmit={onSubmit}
          showErrors={submitAttempted}
          invalid={!isValid}
          invalidMessage={
            <T
              id="trezor.walletCreationPassphrasesMismatched"
              m="Passphrases are different"
            />
          }
        />
      </PassphraseModalField>
      <ButtonsToolbar
        {...{ isValid, onCancelModal, onSubmit }}
        className={styles.buttons}
      />
    </Modal>
  );
};

export default TrezorWalletCreationPassphraseModal;
