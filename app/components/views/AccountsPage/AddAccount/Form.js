import React from "react";
import Header from "../../../Header";
import KeyBlueButton from "../../../KeyBlueButton";
import SlateGrayButton from "../../../SlateGrayButton";
import { AccountStyles } from "../../ViewStyles.js";

const AddAccountForm = ({
  name,
  passPhrase,
  hasAttemptedSave,
  successMsg,
  errorMsg,
  setName,
  setPassPhrase,
  onSave,
  onCancel
}) => (
  <div style={AccountStyles.view}>
    <Header
      headerTitleOverview="Accounts"
      headerTop={[
        errorMsg ? (
          <div key="accountError" style={AccountStyles.viewNotificationError}>{errorMsg}</div>
        ) : (
          <div key="accountError" ></div>
        ),
        successMsg ? (
          <div key="accountSuccess" style={AccountStyles.viewNotificationSuccess}>{successMsg}</div>
        ) : (
          <div key="accountSuccess" ></div>
        )
      ]}
    />

    <div style={AccountStyles.content}>
      <div style={AccountStyles.flexHeight}>
        <div style={AccountStyles.accountFormRow}>
          <div style={AccountStyles.accountFormLabel}>Account Name:</div>
          <div style={AccountStyles.accountFormInput}>
            <div style={AccountStyles.inputForm}>
              <input
                type="text"
                style={AccountStyles.contentNestAddressHashTo}
                placeholder="New Account Name"
                maxLength="50"
                value={name}
                onChange={(e) => setName(e.target.value)}/>
            </div>
          </div>
          {(hasAttemptedSave && !name) ? (
            <div style={AccountStyles.accountFormInputError}>
              *You must enter an account name
            </div>
          ) : null}
        </div>
        <div style={AccountStyles.accountFormRow} key="privatePassPhrase">
          <div style={AccountStyles.accountFormLabel}>Private Passhrase:</div>
          <div style={AccountStyles.accountFormInput}>
            <div style={AccountStyles.inputForm}>
              <input
                id="privpass"
                style={AccountStyles.contentNestAddressHashTo}
                type="password"
                placeholder="Private Password"
                value={passPhrase}
                onChange={(e) => setPassPhrase(e.target.value)}/>
            </div>
          </div>
          {(hasAttemptedSave && !passPhrase) ? (
            <div style={AccountStyles.accountFormInputError}>
              *Please enter your private passphrase
            </div>
          ) : null}

        </div>
      </div>
      <KeyBlueButton
        style={AccountStyles.contentConfirmNewAccount}
        onClick={onSave}
      >Confirm</KeyBlueButton>
      <SlateGrayButton
        style={AccountStyles.contentHideNewAccount}
        onClick={onCancel}
      >Cancel</SlateGrayButton>
    </div>
  </div>
);

export default AddAccountForm;
