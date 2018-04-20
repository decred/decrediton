import { ExternalLink } from "shared";
import { PassphraseModalButton, ScriptRedeemableButton, SlateGrayButton } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { TextInput, StakePoolSelect } from "inputs";
import "style/Layout.less";
import "style/StakePool.less";

const messages = defineMessages({
  apiKeyPlaceholder: {
    id: "stake.apiKeyPlaceholder",
    defaultMessage: "Typically starts with ‘eyJhb…’"
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
    <div className="stakepool-add-title">
      <T id="stakepool.addPoolTitle" m="Add a Stakepool" />
    </div>
    <div className="stakepool-add-area">
      <div className="stakepool-add-area-left">
        <div className="stakepool-field">
          <div className="stakepool-field-label">
            <T id="stakepool.label" m="Stakepool" />:
          </div>
          <div className="stakepool-field-value">
            <StakePoolSelect
              options={unconfiguredStakePools}
              value={selectedUnconfigured}
              onChange={onChangeSelectedUnconfigured}
            />
          </div>
        </div>
        <div className="stakepool-field">
          <div className="stakepool-field-label">
            <T id="stakepool.apikey" m="API Key" />:
          </div>
          <div className="stakepool-field-value">
            <TextInput
              type="text"
              className="stakepool-add-apikey"
              placeholder={intl.formatMessage(messages.apiKeyPlaceholder)}
              value={apiKey}
              onChange={e => onChangeApiKey(e.target.value)}
            />
          </div>
          <div className="stakepool-field-value-error">
            {apiKey ? null : <T id="stake.addPool.errors.noApiKey" m="*Please enter your API key" /> }
          </div>
        </div>
      </div>
      <div className="stakepool-add-area-right">
        <div className="stakepool-add-instructions">
          <T id="stake.addPool.info" m={
            "Create an account or login to your existing account at {stakePoolLink} Once logged in, select the ‘Settings’ tab, copy and paste your API KEY into the field."
          }
          values={{
            stakePoolLink: <ExternalLink href={selectedUnconfigured.label}>{selectedUnconfigured.label}</ExternalLink>
          }}/>
          <ScriptRedeemableButton
            modalTitle={<T id="stake.notRedeemed" m="Script not redeemable?" />}
            modalContent={
              <Aux>
                <span className="stakepool-add-not-redeemable-content"><T id="stake.notRedeemed.content1" m="If you receive an error about the script not being redeemable when attempting to add your stakepool, you can try the following:"/></span>
                <span className="stakepool-add-not-redeemable-content"><T id="stake.notRedeemed.content2" m="1. Each stakepool account you create can only be associated with 1 wallet. If you have previously created this stakepool account with a different wallet (different seed), then you must create a new account. "/></span>
                <span className="stakepool-add-not-redeemable-content"><T id="stake.notRedeemed.content3" m="2. If you had previously used a ‘voting account’, for your ticket purchases, please go to the Accounts page and create a new account. This may now allow you to successfully import your script for your stakepool."/></span>
              </Aux>
            }
            className="stakepool-add-not-redeemable"
            buttonLabel={<T id="stake.notRedeemed" m={"Script not redeemable?"} />}
          />
        </div>
      </div>
    </div>
    <div className="stakepool-add-toolbar">
      <PassphraseModalButton
        modalTitle={<T id="stake.addPoolConfirmation" m="Stakepool Confirmation" />}
        disabled={!apiKey}
        className="stakepool-confirm-button"
        onSubmit={onSetStakePoolInfo}
        buttonLabel={<T id="stake.addPool.addBtn" m="Continue" />}
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
