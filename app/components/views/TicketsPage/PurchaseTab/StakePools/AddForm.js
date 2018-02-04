import { shell } from "electron";
import { PassphraseModalButton, SlateGrayButton } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { TextInput, StakePoolSelect } from "inputs";
import "style/Layout.less";
import "style/StakePool.less";

const messages = defineMessages({
  apiKeyPlaceholder: {
    id: "stake.apiKeyPlaceholder",
    defaultMessage: "API Key"
  }
});

const StakePoolsAddForm = ({
  selectedUnconfigured,
  unconfiguredStakePools,
  configuredStakePools,
  apiKey,
  intl,
  onChangeSelectedUnconfigured,
  onChangeApiKey,
  onSetStakePoolInfo,
  onCancelAddStakePool
}) => (
  <Aux>
    <div className="tab-card">
      <div className="stakepool-flex-height">
        <div className="stakepool-content-nest-from-address">
          <div className="stakepool-content-nest-prefix-send">
            <T id="stake.addPoolTitle" m="Stake Pool" />
          :</div>
          <div className="stakepool-unconfigured-select">
            <StakePoolSelect
              options={unconfiguredStakePools}
              value={selectedUnconfigured}
              onChange={onChangeSelectedUnconfigured}
            />
          </div>
          <div className="stakepool-content-nest-from-address-wallet-icon"></div>
        </div>
        <div className="stakepool-content-nest-api-key-instructions">
          <span>
            <T id="stake.addPool.info" m={`
              Please select your desired stakepool from the above dropdown and follow these instructions:

              1) Create an account or login to your existing account at {stakePoolLink}.
              2) Once logged in, select the 'Settings' tab.
              3) Copy and paste your Api Key into the field below (typically starts with 'eyJhb...').
              4) Click Add and enter your private passphrase.

              {noticeSpan} If you receive an error about the script not being redeemable when attempting to add your stakepool, you can try the following:
              - Each stakepool account you create can only be associated with 1 wallet.  If you have previously created this stakepool account with a different wallet (different seed), then you must create a new account.
              - If you had previously used a 'voting account', for your ticket purchases, please go to the Accounts page and create a new account.  This may now allow you to successfully import your script for your stakepool.
              `}
            values={{
              stakePoolLink: <a className="stakepool-link" onClick={function(x){shell.openExternal(x);}.bind(null, selectedUnconfigured.label)}>{selectedUnconfigured.label}</a>,
              noticeSpan: <span className="stakepool-highligh-text-orange">
                <T id="stake.addPool.notice" m="Notice!" />
              </span>
            }}/>
          </span>
        </div>
        <div className="stakepool-content-nest-to-address">
          <div className="stakepool-content-nest-api-key">
            <div className="stakepool-input-form">
              <TextInput
                type="text"
                className="stakepool-content-nest-address-amount-sum"
                placeholder={intl.formatMessage(messages.apiKeyPlaceholder)}
                value={apiKey}
                onChange={e => onChangeApiKey(e.target.value)}
              />
            </div>
          </div>
          <div className="stakepool-api-key-error">
            {apiKey ? null : <T id="stake.addPool.errors.noApiKey" m="*Please enter your API key" /> }
          </div>
        </div>
      </div>
      <PassphraseModalButton
        modalTitle={<T id="stake.addPoolConfirmation" m="Stakepool Confirmation" />}
        disabled={!apiKey}
        className="stakepool-content-send"
        onSubmit={onSetStakePoolInfo}
        buttonLabel={<T id="stake.addPool.addBtn" m="Add" />}
      />
      {configuredStakePools.length ? (
        <SlateGrayButton
          className="stakepool-hide-config"
          onClick={onCancelAddStakePool}
        ><T id="stake.addPool.cancelBtn" m="Cancel" /></SlateGrayButton>
      ) : null}
    </div>
  </Aux>
);

export default injectIntl(StakePoolsAddForm);
