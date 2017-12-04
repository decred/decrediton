// @flow
import React from "react";
import KeyBlueButton from "KeyBlueButton";
import SlateGrayButton from "SlateGrayButton";
import { FormattedMessage as T } from "react-intl";
import { PasswordInput } from "inputs";
import "style/PassphraseModal.less";

const Modal =({
  hidden,
  heading,
  description,
  passPhrase,
  setPassPhrase,
  hasAttemptedSubmit,
  onSubmit,
  onCancel
}) => (
  <div hidden={hidden} className="passphrase-modal">
    <div className="modal-section">
      <div className="passphrase-modal-header">{heading}</div>
      <div className="passphrase-modal-description">{description}</div>
      <div className="passphrase-modal-field-error-ct">
        <div className="passphrase-modal-field-ct">
          <div className="passphrase-modal-label">
            <T id="passphraseModal.privatePassphrase" m="Private Passphrase" />
            :</div>
          <PasswordInput
            id="passphrase"
            className="passphrase-modal-field"
            placeholder=""
            value={passPhrase}
            onChange={(e) => setPassPhrase(e.target.value)}
          />
        </div>
        <div className="passphrase-modal-error-ct">
          <div className="passphrase-modal-label"></div>
          <div className="passphrase-modal-error">
            {(hasAttemptedSubmit && !passPhrase)
            ? <T id="passphraseModal.errors.noPassphrase" m="*Please enter your private passphrase" />
            : null}
          </div>
        </div>
      </div>
      <div className="passphrase-modal-toolbar">
        <KeyBlueButton className="passphrase-modal-save-button" onClick={onSubmit}>
          <T id="passphraseModal.confirm" m="confirm" />
        </KeyBlueButton>
        <SlateGrayButton className="passphrase-modal-cancel-button" onClick={onCancel}>
          <T id="passphraseModal.cancel" m="cancel" />
        </SlateGrayButton>
      </div>
    </div>
  </div>
);

export default Modal;
