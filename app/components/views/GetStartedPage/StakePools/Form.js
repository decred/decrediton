import { KeyBlueButton, InvisibleButton } from "buttons";
import { FormattedMessage as T, defineMessages, injectIntl } from "react-intl";
import { TextInput, StakePoolSelect } from "inputs";
import { Documentation } from "shared";

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
  onChangeSelectedUnconfigured,
  onChangeApiKey,
}) => (
  <Aux>
    <div className="advanced-page-form">
      <div className="advanced-daemon-row">
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
          <KeyBlueButton onClick={() => {}}>
            <T id="getStarted.stakePools.addBtn" m="Add" />
          </KeyBlueButton>
          <InvisibleButton onClick={() => {}}>
            <T id="getStarted.stakePools.continueBtn" m="Continue" />
          </InvisibleButton>
        </div>
      </div>
      <div className="stakepool-add-area-right">
        <T id="getStarted.stakePools.info" m="Add your existing stakepools APIs here. You can always add them later if you want." />
      </div>
    </div>
  </Aux>
);

export default injectIntl(Form);
