import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { Tooltip, Collapse } from "shared";
import { NewSeedTabMsg, RestoreTabMsg } from "../messages";
import { classNames, Checkbox } from "pi-ui";
import styles from "../GetStarted.module.css";

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
    id: "createwallet.watchonly.tooltip",
    defaultMessage:
      "You’ll not be able to spend any DCR associated with that wallet. It is used only to view the balance and monitor the wallet's transaction activity"
  },
  messageWalletTrezorDescription: {
    id: "createwallet.trezor.tooltip",
    defaultMessage: "Trezor is a hardware wallet."
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
  isPrivacy,
  toggleIsPrivacy,
  onShowTrezorConfig,
  isCreateNewWallet,
  creatingWallet
}) => (
  <>
    {isCreateNewWallet ? (
      <div className={styles.newWalletTitleArea}>
        <div className={classNames(styles.walletIconSmall, styles.createnew)} />
        <div className={styles.newWalletTitle}>
          <NewSeedTabMsg />
        </div>
      </div>
    ) : (
      <div className={styles.newWalletTitleArea}>
        <div className={classNames(styles.walletIconSmall, styles.restore)} />
        <div className={styles.newWalletTitle}>
          <RestoreTabMsg />
        </div>
      </div>
    )}
    <div className={styles.daemonRow}>
      <div className={styles.daemonLabel}>
        {!isCreateNewWallet ? (
          <Tooltip text={intl.formatMessage(messages.messageWalletNameTooltip)}>
            <T id="createwallet.walletname.label" m="Wallet Name" />
          </Tooltip>
        ) : (
          <T id="createwallet.walletname.label" m="Wallet Name" />
        )}
      </div>
      <div className={styles.daemonInput}>
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
      </div>
    </div>
    {!isCreateNewWallet && (
      <div className={classNames(styles.daemonRow, styles.advancedOptions)}>
        <Collapse
          header={
            <T id="createwallet.advancedOptions.label" m="Advanced Options" />
          }
          content={
            <>
              <div className={styles.advancedOption}>
                <Checkbox
                  label={
                    <T id="createwallet.walletOnly.label" m="Watch only" />
                  }
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
                        className={styles.whatsnew}
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
                    messages.messageWalletTrezorDescription
                  )}
                  checked={isTrezor}
                  onChange={toggleTrezor}
                />
              </div>
              <div className={styles.advancedOption}>
                <Checkbox
                  label={<T id="privacy.label" m="Privacy" />}
                  id="privacy"
                  checked={isPrivacy}
                  onChange={toggleIsPrivacy}
                />
              </div>
            </>
          }
        />
      </div>
    )}
    <div className={styles.daemonRow}>
      <KeyBlueButton onClick={createWallet}>
        {creatingWallet ? (
          <T id="wallet.creating.button" m="Creating" />
        ) : (
          <T id="wallet.create.button" m="Continue" />
        )}
      </KeyBlueButton>
      <InvisibleButton onClick={hideCreateWalletForm}>
        <T id="advancedStartup.cancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </>
);

export default CreateWalletForm;
