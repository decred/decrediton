import { KeyBlueButton, InvisibleButton } from "buttons";
import { FormattedMessage as T, defineMessages, injectIntl } from "react-intl";
import { TextInput, StakePoolSelect, PasswordInput } from "inputs";

const messages = defineMessages({
  apiKeyPlaceholder: {
    id: "getStartedStake.apiKeyPlaceholder",
    defaultMessage: "Typically starts with ‘eyJhb…’"
  }
});

const Form = ({
  selectedUnconfigured,
  unconfiguredStakePools,
  intl,
  apiKey,
  isSavingStakePoolConfig,
  walletPrivatePassphrase,
  passPhrase,
  onChangeSelectedUnconfigured,
  onChangeApiKey,
  onSetStakePoolInfo,
  onChangePassPhrase,
  onContinueCreation,
}) => (
  <div className="">
    <div className="getstarted-stakepool-add-row">
      <div className="getstarted-stakepool-add-col left">
        <div className="field">
          <div className="label">
            <T id="getStarted.stakepool.label" m="Stakepool" />:
          </div>
          <div className="value">
            <StakePoolSelect
              creatable
              options={unconfiguredStakePools}
              value={selectedUnconfigured}
              onChange={onChangeSelectedUnconfigured}
            />
          </div>
        </div>
        <div className="field">
          <div className="label">
            <T id="getStarted.stakepool.apikey" m="API Key" />:
          </div>
          <div className="value">
            <TextInput
              type="text"
              className="stakepool-add-apikey"
              placeholder={intl.formatMessage(messages.apiKeyPlaceholder)}
              value={apiKey}
              onChange={e => onChangeApiKey(e.target.value)}
            />
          </div>
        </div>
        { walletPrivatePassphrase ? null :
          <div className="field">
            <div className="label">
              <T id="stakepool.passPhrase" m="Private Passphrase" />:
            </div>
            <div className="value">
              <PasswordInput
                value={passPhrase}
                onChange={e => onChangePassPhrase(e.target.value)}
              />
            </div>
          </div> }
      </div>

      <div className="getstarted-stakepool-add-col right">
        <T id="getStarted.stakePools.info" m="Add your existing stakepools APIs here. You can always add them later if you want. After you're done, you can press 'continue'." />
      </div>
    </div>

    <div className="getstarted-stakepool-add-buttons">
      <KeyBlueButton onClick={onSetStakePoolInfo} loading={isSavingStakePoolConfig} disabled={isSavingStakePoolConfig}>
        <T id="getStarted.stakePools.addBtn" m="Add" />
      </KeyBlueButton>
      <InvisibleButton onClick={onContinueCreation}>
        <T id="getStarted.stakePools.continueBtn" m="Continue" />
      </InvisibleButton>
    </div>
  </div>
);

export default injectIntl(Form);
