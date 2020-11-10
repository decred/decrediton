import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import { PasswordInput, PassphraseModalField } from "inputs";
import { ButtonsToolbar } from "shared";
import { useEffect, useState } from "react";

const TrezorWalletCreationPassphraseModal = (
  isGetStarted,
  device,
  onCancelModal,
  onSubmitPassPhrase
) => {
  const [passphraseValue, setPassphraseValue] = useState("");
  const [passphraseConfirmValue, setPassphraseConfirmValue] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [mismatchedValues, setMismatchedValues] = useState(false);

  useEffect(() =>
    () => {
      setPassphraseValue("");
      setPassphraseConfirmValue("");
    }
    , [])

  const onSubmit = () => {
    if (passphraseValue != passphraseConfirmValue) {
      setSubmitAttempted(true);
      setMismatchedValues(true);
      return;
    }

    onSubmitPassPhrase(passphraseValue);
    setPassphraseValue("");
    setPassphraseConfirmValue("");
  }

  const onChangePassphraseValue = (passphraseValue) => {
    setPassphraseValue(passphraseValue);
    setSubmitAttempted(false);
    setMismatchedValues(false);
  }

  const onChangePassphraseConfirmValue = (passphraseConfirmValue) => {
    setPassphraseConfirmValue(passphraseConfirmValue);
    setSubmitAttempted(false);
    setMismatchedValues(false);
  }

    const trezorLabel = device
      ? deviceLabel
      : "";

    const className = [
      "trezor-passphrase-modal",
      isGetStarted ? "get-started" : ""
    ].join(" ");

    const isValid =
      passphraseValue === passphraseConfirmValue && !!passphraseValue;

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
              "Type the secret passphrase of the wallet to restore from the Trezor device {label}"
            }
            values={{
              label: <span className="trezor-label">'{trezorLabel}'</span>
            }}
          />
        </p>
        <Documentation name="TrezorWalletCreationPassPhraseWarning" />

        <PassphraseModalField
          label={
            <T
              id="trezor.walltCreationPrivatePassphrase"
              m="Wallet PassPhrase"
            />
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
}

export default TrezorWalletCreationPassphraseModal;
