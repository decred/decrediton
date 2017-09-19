import React from "react";
import { shell } from "electron";
import PassphraseModal from "../PassphraseModal";
import SelectStakePool from "../SelectStakePool";
import KeyBlueButton from "../KeyBlueButton";
import SlateGrayButton from "../SlateGrayButton";
import "../../style/Layout.less";
import "../../style/StakePool.less";

const StakePoolsAddForm = ({
  selectedUnconfigured,
  unconfiguredStakePools,
  configuredStakePools,
  apiKey,
  isRequestingPassphrase,
  onChangeSelectedUnconfigured,
  onChangeApiKey,
  onSetStakePoolInfo,
  onSaveStakePool,
  onCancelPassphraseRequest,
  onCancelAddStakePool
}) => (
  <div>
    <PassphraseModal
      hidden={!isRequestingPassphrase}
      submitPassphrase={onSetStakePoolInfo}
      cancelPassphrase={onCancelPassphraseRequest}
      heading={"Enter private passphrase to connect to your stakepool"}
    />
    <div className={isRequestingPassphrase ? "page-content-blur" : "page-content"}>
      <div className="stakepool-flex-height">
        <div className="stakepool-content-nest-from-address">
          <div className="stakepool-content-nest-prefix-send">Stake Pool:</div>
          <div className="stakepool-unconfigured-select">
            <SelectStakePool
              options={unconfiguredStakePools}
              value={selectedUnconfigured}
              onChange={onChangeSelectedUnconfigured}
            />
          </div>
          <div className="stakepool-content-nest-from-address-wallet-icon"></div>
        </div>
        <div className="stakepool-content-nest-api-key-instructions">
          <span>
            Please select your desired stakepool from the above dropdown and follow these instructions:
            <br/>1) Create an account or login to your existing account at <a className="stakepool-link" onClick={function(x){shell.openExternal(x);}.bind(null, selectedUnconfigured.label)}>{selectedUnconfigured.label}</a>.
            <br/>2) Once logged in, select the 'Settings' tab.
            <br/>3) Copy and paste your Api Key into the field below (typically starts with 'eyJhb...').
            <br/>4) Click Add and enter your private passphrase.
            <br/>
            <br/>
            <span className="stakepool-highligh-text-orange">Notice!</span> If you receive an error about the script not being redeemable when attempting to add your stakepool, you can try the following:
            <br/> - Each stakepool account you create can only be associated with 1 wallet.  If you have previously created this stakepool account with a different wallet (different seed), then you must create a new account.
            <br/> - If you had previously used a 'voting account', for your ticket purchases, please go to the Accounts page and create a new account.  This may now allow you to successfully import your script for your stakepool.
          </span>
        </div>
        <div className="stakepool-content-nest-to-address">
          <div className="stakepool-content-nest-api-key">
            <div className="stakepool-input-form">
              <input
                type="text"
                className="stakepool-content-nest-address-amount-sum"
                placeholder="API Key"
                value={apiKey}
                onChange={e => onChangeApiKey(e.target.value)}
              />
            </div>
          </div>
          <div className="stakepool-api-key-error">
            {apiKey ? null : "*Please enter your API key"}
          </div>
        </div>
      </div>
      <KeyBlueButton className="stakepool-content-send" disabled={!apiKey} onClick={onSaveStakePool}>
        Add
      </KeyBlueButton>
      {configuredStakePools.length ? (
        <SlateGrayButton
          className="stakepool-hide-config"
          onClick={onCancelAddStakePool}
        >Cancel</SlateGrayButton>
      ) : null}
    </div>
  </div>
);

export default StakePoolsAddForm;
