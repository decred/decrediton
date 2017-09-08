import React from "react";
import { shell } from "electron";
import PassphraseModal from "../PassphraseModal";
import KeyBlueButton from "../KeyBlueButton";
import SlateGrayButton from "../SlateGrayButton";
import { StakePoolStyles } from "../views/ViewStyles";

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
    <div style={!this.state.passphraseModalOpen ? StakePoolStyles.content : StakePoolStyles.contentBlur}>
      <div style={StakePoolStyles.flexHeight}>
        <div style={StakePoolStyles.contentNestFromAddress}>
          <div style={StakePoolStyles.contentNestPrefixSend}>Stake Pool:</div>
          <div style={StakePoolStyles.stakePoolUnconfiguredSelect}>
            <SelectStakePool
              options={unconfiguredStakePools}
              value={selectedUnconfigured}
              onChange={onChangeSelectedUnconfigured}
            />
          </div>
          <div style={StakePoolStyles.contentNestFromAddressWalletIcon}></div>
        </div>
        <div style={StakePoolStyles.contentNestApiKeyInstructions}>
          <span>
            Please select your desired stakepool from the above dropdown and follow these instructions:
            <br/>1) Create an account or login to your existing account at <a style={StakePoolStyles.stakepoolLink} onClick={function(x){shell.openExternal(x);}.bind(null, selectedUnconfigured.label)}>{selectedUnconfigured.label}</a>.
            <br/>2) Once logged in, select the 'Settings' tab.
            <br/>3) Copy and paste your Api Key into the field below (typically starts with 'eyJhb...').
            <br/>4) Click Add and enter your private passphrase.
            <br/>
            <br/>
            <span style={StakePoolStyles.highlighTextOrange}>Notice!</span> If you receive an error about the script not being redeemable when attempting to add your stakepool, you can try the following:
            <br/> - Each stakepool account you create can only be associated with 1 wallet.  If you have previously created this stakepool account with a different wallet (different seed), then you must create a new account.
            <br/> - If you had previously used a 'voting account', for your ticket purchases, please go to the Accounts page and create a new account.  This may now allow you to successfully import your script for your stakepool.
          </span>
        </div>
        <div style={StakePoolStyles.contentNestToAddress}>
          <div style={StakePoolStyles.contentNestApiKey}>
            <div style={StakePoolStyles.inputForm}>
              <input
                type="text"
                style={StakePoolStyles.contentNestAddressAmountSum}
                placeholder="API Key"
                value={apiKey}
                onChange={e => onChangeApiKey(e.target.value)}
              />
            </div>
          </div>
          {apiKey ? null : (
            <div style={StakePoolStyles.apiKeyError}>{"*Please enter your API key"}</div>
          )}
        </div>
      </div>
      <KeyBlueButton style={StakePoolStyles.contentSend} disabled={!apiKey} onClick={onSaveStakePool}>
        Add
      </KeyBlueButton>
      {configuredStakePools.length ? (
        <SlateGrayButton
          style={StakePoolStyles.hideStakePoolConfig}
          onClick={onCancelAddStakePool}
        >Cancel</SlateGrayButton>
      ) : null}
    </div>
  </div>
);

export default StakePoolsAddForm;
