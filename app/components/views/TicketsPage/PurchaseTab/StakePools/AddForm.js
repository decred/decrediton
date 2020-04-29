import { ExternalLink } from "shared";
import {
  PassphraseModalButton,
  ScriptRedeemableButton,
  SlateGrayButton,
  ImportScriptIconButton
} from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { TextInput, StakePoolSelect } from "inputs";
import { Documentation } from "shared";
import "style/Layout.less";
import "style/StakePool.less";

const messages = defineMessages({
  apiKeyPlaceholder: {
    id: "stake.apiKeyPlaceholder",
    defaultMessage: "Typically starts with ‘eyJhb…’"
  }
});

const UnconfiguedStakepoolLink = ({ selectedUnconfigured }) =>
  selectedUnconfigured ? (
    <ExternalLink href={selectedUnconfigured.label}>
      {selectedUnconfigured.label}
    </ExternalLink>
  ) : null;

const StakePoolsAddForm = ({
  selectedUnconfigured,
  unconfiguredStakePools,
  configuredStakePools,
  apiKey,
  isSavingStakePoolConfig,
  intl,
  onChangeSelectedUnconfigured,
  onChangeApiKey,
  onSetStakePoolInfo,
  onCancelAddStakePool,
  hasFailedAttempt
}) => (
  <>
    <div className="stakepool-add-title">
      <T id="stakepool.addPoolTitle" m="Add a VSP" />
    </div>
    <div className="stakepool-add-area">
      <div className="stakepool-add-area-left">
        <div className="stakepool-field">
          <div className="stakepool-field-label">
            <T id="stakepool.label" m="VSP" />:
          </div>
          <div className="stakepool-field-value">
            <StakePoolSelect
              creatable
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
              required
              showErrors={hasFailedAttempt}
              className="stakepool-add-apikey"
              placeholder={intl.formatMessage(messages.apiKeyPlaceholder)}
              value={apiKey}
              onChange={(e) => onChangeApiKey(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="stakepool-add-area-right">
        <div className="stakepool-add-instructions">
          <div>
            <T
              id="stake.addPool.info"
              m={
                "Create an account or login to your existing account at {stakePoolLink} Once logged in, select the ‘Settings’ tab, copy and paste your API KEY into the field."
              }
              values={{
                stakePoolLink: (
                  <UnconfiguedStakepoolLink {...{ selectedUnconfigured }} />
                )
              }}
            />
          </div>
          <div className="stakepool-link-button-container">
            <ScriptRedeemableButton
              modalTitle={
                <T id="stake.notRedeemed" m="Script not redeemable?" />
              }
              modalContent={<Documentation name="ScriptNotRedeemableInfo" />}
              className="stakepool-add-not-redeemable"
              buttonLabel={
                <T id="stake.notRedeemed" m={"Script not redeemable?"} />
              }
            />
            <ImportScriptIconButton />
          </div>
        </div>
      </div>
      <div className="stakepool-add-toolbar">
        <PassphraseModalButton
          modalTitle={<T id="stake.addPoolConfirmation" m="VSP Confirmation" />}
          loading={isSavingStakePoolConfig}
          disabled={!apiKey || isSavingStakePoolConfig}
          className="stakepool-confirm-button"
          onSubmit={onSetStakePoolInfo}
          buttonLabel={<T id="stake.addPool.addBtn" m="Continue" />}
        />
        {configuredStakePools.length ? (
          <SlateGrayButton
            className="stakepool-hide-config"
            onClick={onCancelAddStakePool}>
            <T id="stake.addPool.cancelBtn" m="Cancel" />
          </SlateGrayButton>
        ) : null}
      </div>
    </div>
  </>
);

export default injectIntl(StakePoolsAddForm);
