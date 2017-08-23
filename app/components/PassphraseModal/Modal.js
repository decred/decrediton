// @flow
import React from "react";
import KeyBlueButton from "../KeyBlueButton";
import SlateGrayButton from "../SlateGrayButton";
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
          <div className="passphrase-modal-label">Private Passphrase:</div>
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
            {(hasAttemptedSubmit && !passPhrase) ? "*Please enter your private passphrase" : null}
          </div>
        </div>
      </div>
      <div className="passphrase-modal-toolbar">
        <KeyBlueButton className="passphrase-modal-save-button" onClick={onSubmit}>save</KeyBlueButton>
        <SlateGrayButton className="passphrase-modal-cancel-button" onClick={onCancel}>cancel</SlateGrayButton>
      </div>
    </div>
  </div>
);

export default Modal;
