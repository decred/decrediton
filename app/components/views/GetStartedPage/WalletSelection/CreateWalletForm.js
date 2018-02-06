import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { KeyBlueButton, NetworkSwitch } from "buttons";
import "style/LoginForm.less";

const messages = defineMessages({
  messageWalletNamePlaceholder: {
    id: "login.form.rpcuser.placeholder",
    defaultMessage: "Enter your wallet name here",
  },
});

const CreateWalletForm = ({
  createWallet,
  newWalletName,
  newWalletNetwork,
  onChangeCreateWalletName,
  onChangeCreateWalletNetwork,
  intl
}) => {
  return (
    <Aux>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="advanced.remote.rpcuser" m="New Wallet Name" />:
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
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <span className="advanced-daemon-network">{newWalletNetwork}</span>
        </div>
        <div className="advanced-daemon-input">
          <NetworkSwitch enabled={newWalletNetwork !== "mainnet"} onClick={onChangeCreateWalletNetwork} />
        </div>
      </div>
      <div className="advanced-daemon-row">
        <KeyBlueButton onClick={createWallet}>
          <T id="login.form.connect.button" m="Connect to Remote" />
        </KeyBlueButton>
      </div>
    </Aux>
  );
};

export default CreateWalletForm;
