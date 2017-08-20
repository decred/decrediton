// @flow
import React from "react";
import KeyBlueButton from "../KeyBlueButton";
import SlateGrayButton from "../SlateGrayButton";
import "../../style/ChangePassphraseModal.less";


const Modal = ({
  hidden,
  heading,
  description,
  privpass,
  oldPrivPass,
  confirmPrivPass,
  privPassError,
  oldPrivPassError,
  confirmPrivPassError,
  updateOldPrivatePassphrase,
  updatePrivatePassphrase,
  updateConfirmPrivatePassphrase,
  submitPassphrase,
  cancelPassphrase
}) => (
 <div hidden={hidden} className="change-passphrase-modal">
    <div className="modal-section">
      {heading ? [
        <div className="change-passphrase-modal-header">{heading}</div>,
        <div className="change-passphrase-modal-description">{description}</div>
      ] : null}
      <div className="change-passphrase-modal-field-ct">
        <div className="change-passphrase-modal-label">Old Private Passphrase:</div>
        <input
          id="oldPassphrase"
          className="change-passphrase-modal-field"
          type="password"
          placeholder=""
          defaultValue={oldPrivPass}
          onChange={(e) => updateOldPrivatePassphrase(e.target.value)}
        />
        <div className="change-passphrase-modal-error">{oldPrivPassError}</div>
      </div>
      <div className="change-passphrase-modal-field-ct">
        <div className="change-passphrase-modal-label">New Private Passphrase:</div>
        <input
          id="passphrase"
          className="change-passphrase-modal-field"
          type="password"
          placeholder=""
          defaultValue={privpass}
          onChange={(e) => updatePrivatePassphrase(e.target.value)}
        />
        <div className="change-passphrase-modal-error">{privPassError}</div>
      </div>
      <div className="change-passphrase-modal-field-ct">
        <div className="change-passphrase-modal-label">Confirm:</div>
        <input
          id='confirmPassphrase'
          className="change-passphrase-modal-field"
          type="password"
          placeholder=""
          defaultValue={confirmPrivPass}
          onChange={(e) => updateConfirmPrivatePassphrase(e.target.value)}
        />
        <div className="change-passphrase-modal-error">{confirmPrivPassError}</div>
      </div>
      <div className="change-passphrase-modal-toolbar">
        <KeyBlueButton className="change-passphrase-modal-save-button" onClick={submitPassphrase}>Update</KeyBlueButton>
        <SlateGrayButton className="change-passphrase-modal-cancel-button" onClick={cancelPassphrase}>cancel</SlateGrayButton>
      </div>
    </div>
  </div>
);

export default Modal;
