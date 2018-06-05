import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import "style/LoginForm.less";

const messages = defineMessages({
  messageWalletNamePlaceholder: {
    id: "createwallet.walletname.placehlder",
    defaultMessage: "Enter your wallet name here",
  },
});

const CreateWalletForm = ({
  newWalletName,
  createNewWallet,
  onChangeCreateWalletName,
  hasFailedAttempt,
  intl
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
    </Aux>
  );
};

export default CreateWalletForm;
