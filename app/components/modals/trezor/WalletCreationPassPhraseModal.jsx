import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import { PasswordInput, PassphraseModalField } from "inputs";
import { ButtonsToolbar } from "shared";
import { useEffect, useState } from "react";
import styles from "./trezor.module.css";

const TrezorWalletCreationPassphraseModal = ({
  isGetStarted,
  device,
  deviceLabel,
  onCancelModal,
  onSubmitPassPhrase
}) => {
  const [passphraseValue, setPassphraseValue] = useState("");
  const [passphraseConfirmValue, setPassphraseConfirmValue] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [mismatchedValues, setMismatchedValues] = useState(false);

  useEffect(
    () => () => {
      setPassphraseValue("");
      setPassphraseConfirmValue("");
    },
    []
  );

  const onSubmit = () => {
    if (passphraseValue != passphraseConfirmValue) {
      setSubmitAttempted(true);
      setMismatchedValues(true);
      return;
    }

    onSubmitPassPhrase(passphraseValue);
    setPassphraseValue("");
    setPassphraseConfirmValue("");
  };

  const onChangePassphraseValue = (passphraseValue) => {
    setPassphraseValue(passphraseValue);
    setSubmitAttempted(false);
    setMismatchedValues(false);
  };

  const onChangePassphraseConfirmValue = (passphraseConfirmValue) => {
    setPassphraseConfirmValue(passphraseConfirmValue);
    setSubmitAttempted(false);
    setMismatchedValues(false);
  };

  const trezorLabel = device ? deviceLabel : "";

  const className = classNames(
    styles.trezorPassphraseModal,
    isGetStarted && styles.getStarted);

<<<<<<< HEAD
    const isValid =
      passphraseValue === passphraseConfirmValue && !!passphraseValue;
=======
  const isValid =
    passphraseValue === passphraseConfirmValue && !!passphraseValue;
>>>>>>> 1544365d (Create trezor.module.css)

  return (
    <Modal className={className} onCancelModal={onCancelModal}>
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
            label: <span className={styles.trezorLabel}>'{trezorLabel}'</span>
          }}
        />
      </p>
      <Documentation name="TrezorWalletCreationPassPhraseWarning" />

      <PassphraseModalField
        label={
          <T id="trezor.walltCreationPrivatePassphrase" m="Wallet PassPhrase" />
        }>
        <PasswordInput
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

      <ButtonsToolbar {...{ isValid, onCancelModal, onSubmit }} />
    </Modal>
  );
};

export default TrezorWalletCreationPassphraseModal;
