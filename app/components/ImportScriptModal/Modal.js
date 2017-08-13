// @flow
import React from "react";
import Radium from "radium";
import KeyBlueButton from "../KeyBlueButton";
import SlateGrayButton from "../SlateGrayButton";

const styles = {
  autoBuyerImportScriptModal: {
    position: "absolute",
    zIndex: "10",
    overflow: "auto",
    height: "556px",
    padding: "54px 160px 54px 180px",
    width: "46%",
    backgroundColor: "rgba(12,30,62, 0.5)"
  },
  importScriptModalSection: {
    padding: "20px",
    backgroundColor: "#fff",
    boxShadow: "0px 13px 21px rgba(0, 0, 0, 0.21)",
  },
  importScriptModalSectionHeadingSubSection: {
    minHeight: "0px",
    paddingBottom: "10px",
    textTransform: "none",
    color: "#0c1e3e",
    fontSize: "19px",
    lineHeight: "18px",
    position: "relative",
    zIndex: "0",
  },
  importScriptModalSectionHeadingSubSectionNotice: {
    color: "#0c1e3e",
    fontSize: "13px",
    lineHeight: "15px",
    position: "relative",
    zIndex: "0",
  },
  highlightTextNeonGreen: {
    color: "#2ed8a3",
  },
  importScriptModalSubSectionPrivImportScript: {
    marginBottom: "3px",
    paddingTop: "11px",
    paddingRight: "10px",
    position: "relative",
    zIndex: "0",
    minHeight: "50px",
  },
  bigPrefix: {
    paddingRight: "10px",
    float: "left",
    color: "#0c1e3e",
    fontSize: "19px",
    height: "100%",
    paddingTop: "5px",
    textAlign: "right",
    textTransform: "capitalize",
  },
  inputImportScriptField: {
    width: "290px",
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
    color: "red",
    fontSize: "10px",
  }
};

const Modal = ({
  hidden,
  heading,
  description,
  script,
  passPhrase,
  hasFailedAttempt,
  setScript,
  setPassPhrase,
  onSubmit,
  onCancel
}) => (
 <div hidden={hidden} style={styles.autoBuyerImportScriptModal}>
    <div style={styles.importScriptModalSection}>
      <div style={styles.importScriptModalSectionHeadingSubSection}>{heading}</div>
      <div style={styles.importScriptModalSectionHeadingSubSectionNotice}>{description}</div>
      <div style={styles.importScriptModalSubSectionPrivImportScript}>
        <div style={styles.bigPrefix}>Redeem Script:</div>
        <input
          id='script'
          style={styles.inputImportScriptField}
          type="text"
          placeholder=""
          value={script}
          onChange={(e) => setScript(e.target.value)}
        />
        {(hasFailedAttempt && !script)
          ? <div style={styles.inputError}>*Please enter your script</div>
          : null}
      </div>
      <div style={styles.importScriptModalSubSectionPrivImportScript}>
        <div style={styles.bigPrefix}>Private Passphrase:</div>
        <input
          id='passphrase'
          style={styles.inputImportScriptField}
          type="password"
          placeholder=""
          value={passPhrase}
          onChange={(e) => setPassPhrase(e.target.value)}
        />
        {(hasFailedAttempt && !passPhrase)
          ? <div style={styles.inputError}>*Please enter your private passphrase</div>
          : null}
      </div>
      <div style={styles.modalSubSectionSaveCancel}>
        <KeyBlueButton style={{float: "left"}} onClick={onSubmit}>save</KeyBlueButton>
        <SlateGrayButton style={{float: "right"}} onClick={onCancel}>cancel</SlateGrayButton>
      </div>
    </div>
  </div>
);

export default Radium(Modal);
