import { FormattedMessage as T, defineMessages } from "react-intl";
import { classNames, Checkbox, Tooltip } from "pi-ui";
import { TextInput, NumericInput } from "inputs";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { Collapse, ExternalLink } from "shared";
import { NewSeedTabMsg, RestoreTabMsg } from "../../messages";
import { Label, Input, Row } from "../../helpers";
import styles from "./CreateWalletForm.module.css";

const messages = defineMessages({
  messageWalletNamePlaceholder: {
    id: "createwallet.walletname.placehlder",
    defaultMessage: "Choose a Name"
  },
  messageWalletNameTooltip: {
    id: "createwallet.walletname.tooltip",
    defaultMessage:
      "The name is used to identify your wallet. Restoring a wallet does not require the name to match the previous wallet name."
  },
  messageWalletWatchOnlyDescription: {
    id: "createwallet.watchonly.description",
    defaultMessage:
      "A watch-only wallet has limited functionality. It can only be used to view the balance and monitor transaction history. You won't be able to spend any DCR associated with this wallet."
  },
  messageWalletTrezorDescription: {
    id: "createwallet.trezor.description",
    defaultMessage:
      "Trezor is a hardware wallet. For more information, visit {link}"
  },
  messageWalletMasterPubKey: {
    id: "createwallet.walletpubkey.placeholder",
    defaultMessage: "Master Pub Key"
  },
  messageWalletMasterPubkeyError: {
    id: "createwallet.walletWatchOnly.error",
    defaultMessage: "Invalid Master Pubkey"
  },
  messageWalletDupeNameError: {
    id: "createwallet.dupeWalletName.error",
    defaultMessage: "Please choose an unused wallet name"
  },
  messageDisablecointypeupgrades: {
    id: "createwallet.disablecointypeupgrades.description",
    defaultMessage:
      "Never upgrade from legacy to SLIP0044 coin type keys"
  }
});

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
  isTrezor,
  toggleTrezor,
  onShowTrezorConfig,
  isCreateNewWallet,
  creatingWallet,
  disableCoinTypeUpgrades,
  toggleDisableCoinTypeUpgrades,
  gapLimit,
  setGapLimit
}) => (
  <>
    {isCreateNewWallet ? (
      <div className={styles.titleArea}>
        <div className={classNames(styles.iconSmall, styles.new)} />
        <div className={styles.title}>
          <NewSeedTabMsg />
        </div>
      </div>
    ) : (
      <div className={styles.titleArea}>
        <div className={classNames(styles.iconSmall, styles.restore)} />
        <div className={styles.title}>
          <RestoreTabMsg />
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
                    <div className={styles.daemonLongInput}>
                      <TextInput
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
                    <>
                      <T id="createwallet.isTrezor.label" m="Trezor" />
                      <span
                        className={styles.trezorWallet}
                        onClick={onShowTrezorConfig}>
                        <T
                          id="createWallet.isTrezor.setupLink"
                          m="(setup device)"
                        />
                      </span>
                    </>
                  }
                  id="trezor"
                  description={intl.formatMessage(
                    messages.messageWalletTrezorDescription,
                    {
                      link: (
                        <ExternalLink
                          className={styles.trezorDocs}
                          href="https://docs.decred.org/wallets/decrediton/trezor/">
                          docs.decred.org
                        </ExternalLink>
                      )
                    }
                  )}
                  checked={isTrezor}
                  onChange={toggleTrezor}
                />
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
              <div className={styles.advancedOption}>
                <label id="gap-limit-input" className={styles.gapLimitlabel}>
                  <T id="createwallet.gapLimit.label" m="Gap Limit" />
                  <div className={styles.gapLimitInput}>
                    <NumericInput
                      value={gapLimit}
                      ariaLabelledBy="gap-limit-input"
                      onChange={(e) =>
                        setGapLimit(e.target.value)
                      }
                    />
                  </div>
                </label>
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
        {creatingWallet ? (
          <T id="wallet.creating.button" m="Creating" />
        ) : (
          <T id="wallet.create.button" m="Continue" />
        )}
      </KeyBlueButton>
    </Row>
  </>
);

export default CreateWalletForm;
