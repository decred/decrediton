import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { WatchOnlyWalletSwitch, EyeFilterMenu } from "buttons";
import "style/LoginForm.less";

const messages = defineMessages({
  messageWalletNamePlaceholder: {
    id: "createwallet.walletname.placehlder",
    defaultMessage: "Enter your wallet name here",
  },
  messageWalletMasterPubKey: {
    id: "createwallet.walletpubkey.placeholder",
    defaultMessage: "Enter wallet master pub key here",
  },
  messageWalletMasterPubkeyError: {
    id: "createwallet.walletWatchOnly.error",
    defaultMessage: "Wrong Master Pubkey",
  }
});

const CreateWalletForm = ({
  newWalletName,
  createNewWallet,
  onChangeCreateWalletName,
  hasFailedAttempt,
  intl,
  isWatchOnly,
  walletMasterPubKey,
  toggleWatchOnly,
  onChangeCreateWalletMasterPubKey,
  masterPubKeyError,
  ...props
}) => {
  return (
    <Aux>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          {!createNewWallet ?
            <T id="createwallet.walletname.label" m="New Wallet Name" /> :
            <T id="createwallet.walletname.restored.label" m="Restored Wallet Name" />
          }
        </div>
        <div className="advanced-daemon-input">
          <TextInput
            required
            value={newWalletName}
            onChange={(e) => onChangeCreateWalletName(e.target.value)}
            placeholder={intl.formatMessage(messages.messageWalletNamePlaceholder)}
            showErrors={hasFailedAttempt}
          />
        </div>
      </div>
      <div className="advanced-daemon-row">
        <div className="wallet-switch-wrapper">
          <WatchOnlyWalletSwitch className="wallet-switch" enabled={ isWatchOnly } onClick={ toggleWatchOnly } />
          {isWatchOnly ? <T id="createwallet.walletOnly.label" m="Watch only wallet" /> :
              <T id="createwallet.notWalletOnly.label" m="Not Watch only wallet" />}
        </div>
      </div>
        {isWatchOnly &&
              (
                <div className="advanced-daemon-row">
                  <div className="advanced-daemon-label">
                    <T id="createwallet.walletmasterpubkey.label" m="Master Pub key here" />
                  </div>
                  <div className="advanced-daemon-long-input">
                    <TextInput
                      required
                      value={ walletMasterPubKey }
                      onChange={(e) => onChangeCreateWalletMasterPubKey(e.target.value)}
                      placeholder={ intl.formatMessage(messages.messageWalletMasterPubKey) }
                      showErrors={ hasFailedAttempt || masterPubKeyError }
                      invalid={ masterPubKeyError }
                      invalidMessage={ intl.formatMessage(messages.messageWalletMasterPubkeyError) }
                    />
                  </div>
                </div>
            )}
    </Aux>
  );
};

export default CreateWalletForm;
