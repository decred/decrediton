import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { KeyBlueButton, InvisibleButton, WatchOnlyWalletSwitch } from "buttons";
import "style/LoginForm.less";

const messages = defineMessages({
  messageWalletNamePlaceholder: {
    id: "createwallet.walletname.placehlder",
    defaultMessage: "Choose a Name",
  },
  messageWalletMasterPubKey: {
    id: "createwallet.walletpubkey.placeholder",
    defaultMessage: "Master Pub Key",
  },
  messageWalletMasterPubkeyError: {
    id: "createwallet.walletWatchOnly.error",
    defaultMessage: "Invalid Master Pubkey",
  },
  messageWalletDupeNameError: {
    id: "createwallet.dupeWalletName.error",
    defaultMessage: "Please choose an unused wallet name",
  }
});

const CreateWalletForm = ({
  createWallet,
  hideCreateWalletForm,
  newWalletName,
  walletNameError,
  createNewWallet,
  onChangeCreateWalletName,
  hasFailedAttemptName,
  hasFailedAttemptPubKey,
  intl,
  isWatchOnly,
  walletMasterPubKey,
  toggleWatchOnly,
  onChangeCreateWalletMasterPubKey,
  masterPubKeyError,
}) => {
  return (
    <Aux>
      {!createNewWallet ?
        <div className="new-wallet-title-area">
          <div className="wallet-icon-small createnew" />
          <div className="new-wallet-title">
            <T id="getStarted.newSeedTab" m="Create a New Wallet"/>
          </div>
        </div> :
        <div className="new-wallet-title-area">
          <div className="wallet-icon-small restore" />
          <div className="new-wallet-title">
            <T id="getStarted.restore" m="Restore Existing Wallet"/>
          </div>
        </div>
      }
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="createwallet.walletname.label" m="Wallet Name" />
        </div>
        <div className="advanced-daemon-input">
          <TextInput
            required
            invalid={walletNameError}
            invalidMessage={intl.formatMessage(messages.messageWalletDupeNameError)}
            value={newWalletName}
            onChange={(e) => onChangeCreateWalletName(e.target.value)}
            placeholder={intl.formatMessage(messages.messageWalletNamePlaceholder)}
            showErrors={hasFailedAttemptName}
          />
        </div>
      </div>
      {createNewWallet &&
        <Aux>
          <div className="advanced-daemon-row">
            <div className="advanced-daemon-label">
              <T id="createwallet.walletOnly.label" m="Watch only" />
            </div>
            <div className="advanced-daemon-input">
              <WatchOnlyWalletSwitch className="wallet-switch" enabled={ isWatchOnly } onClick={ toggleWatchOnly } />
            </div>
          </div>
          {isWatchOnly &&
            <div className="advanced-daemon-row">
              <div className="advanced-daemon-label">
                <T id="createwallet.walletmasterpubkey.label" m="Master Pub Key" />
              </div>
              <div className="advanced-daemon-long-input">
                <TextInput
                  required
                  value={ walletMasterPubKey }
                  onChange={(e) => onChangeCreateWalletMasterPubKey(e.target.value)}
                  placeholder={ intl.formatMessage(messages.messageWalletMasterPubKey) }
                  showErrors={ hasFailedAttemptPubKey || masterPubKeyError }
                  invalid={ masterPubKeyError }
                  invalidMessage={ intl.formatMessage(messages.messageWalletMasterPubkeyError) }
                />
              </div>
            </div>}
        </Aux>}
      <div className="advanced-daemon-row">
        <KeyBlueButton onClick={createWallet}>
          <T id="wallet.create.button" m="Continue" />
        </KeyBlueButton>
        <InvisibleButton onClick={hideCreateWalletForm}>
          <T id="advancedStartup.cancel" m="Cancel"/>
        </InvisibleButton>
      </div>
    </Aux>
  );
};

export default CreateWalletForm;
