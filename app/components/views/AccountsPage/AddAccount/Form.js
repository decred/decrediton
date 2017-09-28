import React from "react";
import Header from "../../../Header";
import KeyBlueButton from "../../../KeyBlueButton";
import SlateGrayButton from "../../../SlateGrayButton";
import { FormattedMessage } from "react-intl";
import "../../../../style/Layout.less";
import "../../../../style/AccountsPage.less";

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
  <div className="page-view">
    <Header
      headerTitleOverview="Accounts"
      headerTop={[
        errorMsg ? (
          <div key="accountError" className="account-view-notification-error">{errorMsg}</div>
        ) : (
          <div key="accountError" ></div>
        ),
        successMsg ? (
          <div key="accountSuccess" className="account-view-notification-success">{successMsg}</div>
        ) : (
          <div key="accountSuccess" ></div>
        )
      ]}
    />

    <div className="page-content">
      <div className="account-flex-height">
        <div className="account-form-row">
          <div className="account-form-label">
            <FormattedMessage id="accounts.formNew.name" defaultMessage="Account Name" />
            :</div>
          <div className="account-form-input">
            <div className="account-input-form">
              <input
                type="text"
                className="account-nest-address-hash-to"
                placeholder="New Account Name"
                maxLength="50"
                value={name}
                onChange={(e) => setName(e.target.value)}/>
            </div>
          </div>
          {(hasAttemptedSave && !name) ? (
            <div className="account-form-input-error">
              <FormattedMessage id="accounts.formNew.errors.noName" defaultMessage="*You must enter an account name" />
            </div>
          ) : null}
        </div>
        <div className="account-form-row" key="privatePassPhrase">
          <div className="account-form-label"><FormattedMessage id="accounts.formNew.privatePassphrase" defaultMessage="Private Passphrase" />:</div>
          <div className="account-form-input">
            <div className="account-input-form">
              <input
                id="privpass"
                className="account-nest-address-hash-to"
                type="password"
                placeholder="Private Password"
                value={passPhrase}
                onChange={(e) => setPassPhrase(e.target.value)}/>
            </div>
          </div>
          {(hasAttemptedSave && !passPhrase) ? (
            <div className="account-form-input-error">
              <FormattedMessage id="accounts.formNew.errors.noPassphrase" defaultMessage="*Please enter your private passphrase" />
            </div>
          ) : null}

        </div>
      </div>
      <div className="account-form-buttons">
        <KeyBlueButton
          className="confirm-new-account-button"
          onClick={onSave}
        ><FormattedMessage id="accounts.formNew.confirmBtn" defaultMessage="Confirm" /></KeyBlueButton>
        <SlateGrayButton
          className="hide-new-account-button"
          onClick={onCancel}
        ><FormattedMessage id="accounts.formNew.cancelBtn" defaultMessage="Cancel" /></SlateGrayButton>
      </div>
    </div>
  </div>
);

export default AddAccountForm;
