// @flow
import React from "react";
import KeyBlueButton from "../KeyBlueButton";
import SlateGrayButton from "../SlateGrayButton";
import { FormattedMessage } from "react-intl";
import "../../style/PassphraseModal.less";

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
            <FormattedMessage id="passphraseModal.privatePassphrase" defaultMessage="Private Passphrase" />
            :</div>
          <input
            id="passphrase"
            className="passphrase-modal-field"
            type="password"
            placeholder=""
            value={passPhrase}
            onChange={(e) => setPassPhrase(e.target.value)}
          />
        </div>
        <div className="passphrase-modal-error-ct">
          <div className="passphrase-modal-label"></div>
          <div className="passphrase-modal-error">
            {(hasAttemptedSubmit && !passPhrase)
            ? <FormattedMessage id="passphraseModal.errors.noPassphrase" defaultMessage="*Please enter your private passphrase" />
            : null}
          </div>
        </div>
      </div>
      <div className="passphrase-modal-toolbar">
        <KeyBlueButton className="passphrase-modal-save-button" onClick={onSubmit}>
          <FormattedMessage id="passphraseModal.save" defaultMessage="save" />
        </KeyBlueButton>
        <SlateGrayButton className="passphrase-modal-cancel-button" onClick={onCancel}>
          <FormattedMessage id="passphraseModal.cancel" defaultMessage="cancel" />
        </SlateGrayButton>
      </div>
    </div>
  </div>
);

export default Modal;
