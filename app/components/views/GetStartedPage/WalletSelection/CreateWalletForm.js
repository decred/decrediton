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
  onChangeCreateWalletName,
  intl
}) => {
  return (
    <Aux>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="createwallet.walletname.label" m="New Wallet Name" />
        </div>
        <div className="advanced-daemon-input">
          <TextInput
            type="text"
            required
            value={newWalletName}
            onChange={(e) => onChangeCreateWalletName(e.target.value)}
            placeholder={intl.formatMessage(messages.messageWalletNamePlaceholder)}
            showErrors
          />
        </div>
      </div>
    </Aux>
  );
};

export default CreateWalletForm;
