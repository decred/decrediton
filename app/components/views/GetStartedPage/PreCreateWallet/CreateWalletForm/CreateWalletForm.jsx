import { FormattedMessage as T } from "react-intl";
import { classNames, Checkbox, Tooltip } from "pi-ui";
import { TextInput, IntegerInput } from "inputs";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { Collapse, ExternalLink } from "shared";
import { LoaderTitleMsg, messages } from "../../messages";
import { Label, Input, Row, ContentContainer } from "../../helpers";
import styles from "./CreateWalletForm.module.css";

const CreateWalletForm = ({
  createWallet,
  hideCreateWalletForm,
  newWalletName,
  walletNameError,
  onChangeCreateWalletName,
  hasFailedAttemptName,
  hasFailedAttemptPubKey,
  intl,
  isWatchingOnly,
  walletMasterPubKey,
  toggleWatchOnly,
  onChangeCreateWalletMasterPubKey,
  masterPubKeyError,
  isCreateNewWallet,
  disableCoinTypeUpgrades,
  toggleDisableCoinTypeUpgrades,
  gapLimit,
  setGapLimit
}) => (
  <>
    <ContentContainer>
      <div>
        <LoaderTitleMsg />
      </div>
    </ContentContainer>
    {isCreateNewWallet ? (
      <div className={styles.titleArea}>
        <div className={classNames(styles.iconSmall, styles.new)} />
        <div className={styles.title}>
          {intl.formatMessage(messages.newSeedTabMsg)}
        </div>
      </div>
    ) : (
      <div className={styles.titleArea}>
        <div className={classNames(styles.iconSmall, styles.restore)} />
        <div className={styles.title}>
          {intl.formatMessage(messages.restoreTabMsg)}
        </div>
      </div>
    )}
    <Row>
      <Label>
        {!isCreateNewWallet ? (
          <Tooltip
            content={intl.formatMessage(messages.messageWalletNameTooltip)}>
            <T id="createwallet.walletname.label" m="Wallet Name" />
          </Tooltip>
        ) : (
          <T id="createwallet.walletname.label" m="Wallet Name" />
        )}
      </Label>
      <Input>
        <TextInput
          id="walletNameInput"
          required
          invalid={walletNameError}
          invalidMessage={intl.formatMessage(
            messages.messageWalletDupeNameError
          )}
          value={newWalletName}
          onChange={(e) => onChangeCreateWalletName(e.target.value)}
          placeholder={intl.formatMessage(
            messages.messageWalletNamePlaceholder
          )}
          showErrors={hasFailedAttemptName}
        />
      </Input>
    </Row>
    {!isCreateNewWallet && (
      <Row className={styles.advancedOptions}>
        <Collapse
          header={
            <T id="createwallet.advancedOptions.label" m="Advanced Options" />
          }
          content={
            <>
              <div className={styles.advancedOption}>
                <Checkbox
                  label={<T id="createwallet.watchOnly.label" m="Watch only" />}
                  id="watchonly"
                  description={intl.formatMessage(
                    messages.messageWalletWatchOnlyDescription
                  )}
                  checked={isWatchingOnly}
                  onChange={toggleWatchOnly}
                />
                {isWatchingOnly && (
                  <div className={styles.extra}>
                    <T
                      id="createwallet.walletmasterpubkey.label"
                      m="Master Pub Key"
                    />
                    :
                    <div className={styles.daemonLongInput}>
                      <TextInput
                        id="masterPubKeyInput"
                        required
                        value={walletMasterPubKey}
                        onChange={(e) =>
                          onChangeCreateWalletMasterPubKey(e.target.value)
                        }
                        placeholder={intl.formatMessage(
                          messages.messageWalletMasterPubKey
                        )}
                        showErrors={hasFailedAttemptPubKey || masterPubKeyError}
                        invalid={masterPubKeyError}
                        invalidMessage={intl.formatMessage(
                          messages.messageWalletMasterPubkeyError
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.advancedOption}>
                <Checkbox
                  label={
                    <T
                      id="createwallet.disableCoinTypeUpgrades.label"
                      m="Disable coin type upgrades"
                    />
                  }
                  id="disableCoinTypeUpgrades"
                  description={intl.formatMessage(
                    messages.messageDisablecointypeupgrades
                  )}
                  checked={disableCoinTypeUpgrades}
                  onChange={toggleDisableCoinTypeUpgrades}
                />
              </div>
              <div
                className={classNames(styles.advancedOption, styles.gapLimit)}>
                <label id="gap-limit-input">
                  <T id="createwallet.gapLimit.label" m="Gap Limit" />:
                </label>
                <IntegerInput
                  id="gap-limit-input"
                  className={styles.gapLimitInput}
                  value={gapLimit}
                  ariaLabelledBy="gap-limit-input"
                  onChange={(e) => setGapLimit(e.target.value)}
                />
              </div>
              <div className={styles.gapLimitDesc}>
                {intl.formatMessage(messages.messageGapLimit)}
              </div>
            </>
          }
        />
      </Row>
    )}
    <Row className={styles.buttonContrainer}>
      <InvisibleButton onClick={hideCreateWalletForm}>
        <T id="advancedStartup.cancel" m="Cancel" />
      </InvisibleButton>
      <KeyBlueButton onClick={createWallet}>
        {isCreateNewWallet ? (
          <T id="wallet.creating.button" m="Creating" />
        ) : (
          <T id="wallet.create.button" m="Continue" />
        )}
      </KeyBlueButton>
    </Row>
  </>
);

export default CreateWalletForm;
