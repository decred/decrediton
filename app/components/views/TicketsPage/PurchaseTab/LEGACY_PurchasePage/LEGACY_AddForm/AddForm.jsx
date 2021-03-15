import { ExternalLink } from "shared";
import {
  ScriptRedeemableButton,
  SlateGrayButton,
  ImportScriptIconButton
} from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { TextInput, LEGACY_StakePoolSelect } from "inputs";
import styles from "./AddForm.module.css";
import { AddVSPButton } from "buttons";
import { Checkbox } from "pi-ui";

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
  toggleIsLegacy,
  addCustomStakePool
}) => (
  <>
    <div className={styles.addTitle}>
      <T id="stakepool.addPoolTitle" m="Add a VSP" />
      <div className={styles.iconWrapper}>
        <Checkbox
          label={<T id="purchase.isLegacy.legacy.add" m="Use Legacy VSP" />}
          className={styles.useLegacyLabel}
          id="box"
          checked={true}
          onChange={() => toggleIsLegacy(false)}
        />
      </div>
    </div>
    <div className={styles.addArea}>
      <div className={styles.addAreaLeft}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            <T id="stakepool.label" m="VSP" />:
          </div>
          <div className={styles.fieldValue}>
            <LEGACY_StakePoolSelect
              creatable
              options={unconfiguredStakePools}
              value={selectedUnconfigured}
              onChange={onChangeSelectedUnconfigured}
              addCustomStakePool={addCustomStakePool}
            />
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            <T id="stakepool.apikey" m="API Key" />:
          </div>
          <div className={styles.fieldValue}>
            <TextInput
              required
              showErrors={hasFailedAttempt}
              placeholder={intl.formatMessage(messages.apiKeyPlaceholder)}
              value={apiKey}
              onChange={(e) => onChangeApiKey(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={styles.addAreaRight}>
        <div>
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
          <div className={styles.linkButtonContainer}>
            <ScriptRedeemableButton
              document={"ScriptNotRedeemableInfo"}
              className={styles.addNotRedeemable}
              buttonLabel={
                <T id="stake.notRedeemed" m={"Script not redeemable?"} />
              }
            />
            <ImportScriptIconButton />
          </div>
        </div>
      </div>
      <div className={styles.addToolbar}>
        <AddVSPButton
          modalTitle={<T id="stake.addPoolConfirmation" m="VSP Confirmation" />}
          loading={isSavingStakePoolConfig}
          disabled={!apiKey || isSavingStakePoolConfig}
          className={styles.confirmButton}
          onSubmit={onSetStakePoolInfo}
          buttonLabel={<T id="stake.addPool.addBtn" m="Continue" />}
          modalContent={
            <T
              id="stake.addPool.modalContent"
              m="Are you sure you want to add this new VSP?"
            />
          }
        />
        {configuredStakePools.length ? (
          <SlateGrayButton
            className={styles.hideConfig}
            onClick={onCancelAddStakePool}>
            <T id="stake.addPool.cancelBtn" m="Cancel" />
          </SlateGrayButton>
        ) : null}
      </div>
    </div>
  </>
);

export default injectIntl(StakePoolsAddForm);
