import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import {
  KeyBlueButton,
  InvisibleButton,
  WatchOnlyWalletSwitch,
  TrezorWalletSwitch
} from "buttons";
import { NewSeedTabMsg, RestoreTabMsg } from "../messages";
import { classNames } from "pi-ui";
import styles from "../GetStarted.module.css";

const messages = defineMessages({
  messageWalletNamePlaceholder: {
    id: "createwallet.walletname.placehlder",
    defaultMessage: "Choose a Name"
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
        <T id="createwallet.walletname.label" m="Wallet Name" />
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
      <>
        <div className={styles.daemonRow}>
          <div className={styles.daemonLabel}>
            <T id="createwallet.walletOnly.label" m="Watch only" />
          </div>
          <div className={styles.daemonInput}>
            <WatchOnlyWalletSwitch
              className={styles.walletSwitch}
              enabled={isWatchingOnly}
              onClick={toggleWatchOnly}
            />
          </div>
        </div>
        <div className={styles.daemonRow}>
          <div className={styles.daemonLabel}>
            <T id="createwallet.isTrezor.label" m="Trezor" />
          </div>
          <div className={styles.daemonInput}>
            <TrezorWalletSwitch
              className={styles.walletSwitch}
              enabled={isTrezor}
              onClick={toggleTrezor}
            />
            <span onClick={onShowTrezorConfig} className={styles.whatsnew}>
              <T id="createWallet.isTrezor.setupLink" m="(setup device)" />
            </span>
          </div>
        </div>
        {isWatchingOnly && (
          <div className={styles.daemonRow}>
            <div className={styles.daemonLabel}>
              <T
                id="createwallet.walletmasterpubkey.label"
                m="Master Pub Key"
              />
            </div>
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
      </>
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
