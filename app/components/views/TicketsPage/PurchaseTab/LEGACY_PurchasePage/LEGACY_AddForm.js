import { ExternalLink } from "shared";
import {
  ScriptRedeemableButton,
  SlateGrayButton,
  ImportScriptIconButton
} from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { TextInput, LEGACY_StakePoolSelect } from "inputs";
import "style/Layout.less";
import "style/StakePool.less";
import styles from "../PurchaseTab.module.css";
import { AddVSPButton } from "buttons";

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
  hasFailedAttempt,
  toggleIsLegacy
}) => (
    <>
      <div className="stakepool-add-title">
        <T id="stakepool.addPoolTitle" m="Add a VSP" />
        <div className={styles.checkbox}>
          <div className={styles.label}><T id="purchase.isLegacy.legacy.add" m="Is Legacy" /></div>
          <input id="box" type="checkbox" checked={true} onChange={() => toggleIsLegacy(false)} />
          <label htmlFor="box" className={styles.checkboxLabel}></label>
        </div>
      </div>
      <div className="stakepool-add-area">
        <div className="stakepool-add-area-left">
          <div className="stakepool-field">
            <div className="stakepool-field-label">
              <T id="stakepool.label" m="VSP" />:
          </div>
            <div className="stakepool-field-value">
              <LEGACY_StakePoolSelect
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
                document={"ScriptNotRedeemableInfo"}
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
          <AddVSPButton
            modalTitle={<T id="stake.addPoolConfirmation" m="VSP Confirmation" />}
            loading={isSavingStakePoolConfig}
            disabled={!apiKey || isSavingStakePoolConfig}
            className="stakepool-confirm-button"
            onSubmit={onSetStakePoolInfo}
            buttonLabel={<T id="stake.addPool.addBtn" m="Continue" />}
            modalContent={<T id="stake.addPool.modalContent" m="Are you sure you want to add this new VSP?" />}
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
