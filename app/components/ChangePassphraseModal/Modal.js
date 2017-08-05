// @flow
import React from "react";
import Radium from "radium";
import KeyBlueButton from "../KeyBlueButton";
import SlateGrayButton from "../SlateGrayButton";

const styles = {
  autoBuyerPassphraseModal: {
    position: "absolute",
    zIndex: "10",
    overflow: "auto",
    height: "556px",
    padding: "54px 160px 54px 180px",
    width: "46%",
    backgroundColor: "rgba(12,30,62, 0.5)"
  },
  autobuyerPassphraseModalSection: {
    padding: "20px",
    backgroundColor: "#fff",
  },
  autobuyerPassphraseModalSectionHeadingSubSection: {
    minHeight: "0px",
    paddingBottom: "10px",
    textTransform: "none",
    color: "#0c1e3e",
    fontSize: "19px",
    lineHeight: "18px",
    position: "relative",
    zIndex: "0",
  },
  autobuyerPassphraseModalSectionHeadingSubSectionNotice: {
    color: "#0c1e3e",
    fontSize: "13px",
    lineHeight: "15px",
    position: "relative",
    zIndex: "0",
  },
  highlightTextNeonGreen: {
    color: "#2ed8a3",
  },
  autobuyerPassphraseModalSubSectionPrivPassphrase: {
    marginBottom: "3px",
    paddingTop: "11px",
    paddingRight: "10px",
    position: "relative",
    zIndex: "0",
    minHeight: "50px",
  },
  bigPrefix: {
    float: "left",
    color: "#0c1e3e",
    fontSize: "19px",
    height: "100%",
    width: "200px",
    paddingTop: "5px",
    paddingRight: "10px",
    textAlign: "right",
    textTransform: "capitalize",
  },
  inputPassphraseField: {
    width: "260px",
    padding: "7px 10px",
    float: "left",
    borderStyle: "solid",
    borderWidth: "0px 0px 1px",
    borderColor: "#000 #000 #a9b4bf",
    color: "#0c1e3e",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "2px",
    margin: "0",
  },
  modalSubSectionSaveCancel: {
    height: "44px",
  },
  inputError: {
    textAlign: "right",
    color: "red",
    fontSize: "10px",
  }
};

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
 <div hidden={hidden} style={styles.autoBuyerPassphraseModal}>
    <div style={styles.autobuyerPassphraseModalSection}>
      <div style={styles.autobuyerPassphraseModalSectionHeadingSubSection}>{heading}</div>
      <div style={styles.autobuyerPassphraseModalSectionHeadingSubSectionNotice}>{description}</div>
      <div style={styles.autobuyerPassphraseModalSubSectionPrivPassphrase}>
        <div style={styles.bigPrefix}>Old Private Passphrase:</div>
        <input
          id='oldPassphrase'
          style={styles.inputPassphraseField}
          type="password" placeholder=""
          defaultValue={oldPrivPass}
          onChange={(e) => updateOldPrivatePassphrase(e.target.value)}
        />
        <div style={styles.inputError}>{oldPrivPassError}</div>
      </div>
      <div style={styles.autobuyerPassphraseModalSubSectionPrivPassphrase}>
        <div style={styles.bigPrefix}>New Private Passphrase:</div>
        <input
          id='passphrase'
          style={styles.inputPassphraseField}
          type="password"
          placeholder=""
          defaultValue={privpass}
          onChange={(e) => updatePrivatePassphrase(e.target.value)}
        />
        <div style={styles.inputError}>{privPassError}</div>
      </div>
      <div style={styles.autobuyerPassphraseModalSubSectionPrivPassphrase}>
        <div style={styles.bigPrefix}>Confirm:</div>
        <input
          id='confirmPassphrase'
          style={styles.inputPassphraseField}
          type="password"
          placeholder=""
          defaultValue={confirmPrivPass}
          onChange={(e) => updateConfirmPrivatePassphrase(e.target.value)}
        />
        <div style={styles.inputError}>{confirmPrivPassError}</div>
      </div>
      <div style={styles.modalSubSectionSaveCancel}>
        <KeyBlueButton style={{float: "left"}} onClick={submitPassphrase}>Update</KeyBlueButton>
        <SlateGrayButton style={{float: "right"}} onClick={cancelPassphrase}>cancel</SlateGrayButton>
      </div>
    </div>
  </div>
);

export default Radium(Modal);
