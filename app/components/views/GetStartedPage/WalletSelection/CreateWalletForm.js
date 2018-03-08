import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import "style/LoginForm.less";

const messages = defineMessages({
  messageWalletNamePlaceholder: {
    id: "login.form.rpcuser.placeholder",
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
          <T id="advanced.remote.rpcuser" m="New Wallet Name" />
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
