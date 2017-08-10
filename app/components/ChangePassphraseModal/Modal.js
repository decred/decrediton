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
        <div className="header">{heading}</div>,
        <div className="description">{description}</div>
      ] : null}
      <div className="field-ct">
        <div className="label">Old Private Passphrase:</div>
        <input
          id="oldPassphrase"
          className="field"
          type="password"
          placeholder=""
          defaultValue={oldPrivPass}
          onChange={(e) => updateOldPrivatePassphrase(e.target.value)}
        />
        <div className="error">{oldPrivPassError}</div>
      </div>
      <div className="field-ct">
        <div className="label">New Private Passphrase:</div>
        <input
          id="passphrase"
          className="field"
          type="password"
          placeholder=""
          defaultValue={privpass}
          onChange={(e) => updatePrivatePassphrase(e.target.value)}
        />
        <div className="error">{privPassError}</div>
      </div>
      <div className="field-ct">
        <div className="label">Confirm:</div>
        <input
          id='confirmPassphrase'
          className="field"
          type="password"
          placeholder=""
          defaultValue={confirmPrivPass}
          onChange={(e) => updateConfirmPrivatePassphrase(e.target.value)}
        />
        <div className="error">{confirmPrivPassError}</div>
      </div>
      <div className="toolbar">
        <KeyBlueButton className="save-button" onClick={submitPassphrase}>Update</KeyBlueButton>
        <SlateGrayButton className="cancel-button" onClick={cancelPassphrase}>cancel</SlateGrayButton>
      </div>
    </div>
  </div>
);

export default Modal;
