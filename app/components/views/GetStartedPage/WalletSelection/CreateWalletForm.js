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
  networkSelected,
  newWalletName,
  onChangeCreateWalletName,
  onChangeCreateWalletNetwork,
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
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="advanced.toggle.network" m="Network" />
        </div>
        <div className="advanced-daemon-input">
          <div className="text-toggle network">
            <div className={"text-toggle-button-left " + (networkSelected && "text-toggle-button-active")} onClick={!networkSelected ? onChangeCreateWalletNetwork : null}>
              <T id="advancedDaemon.toggle.mainnet" m="Mainnet" />
            </div>
            <div className={"text-toggle-button-right " + (!networkSelected && "text-toggle-button-active")} onClick={networkSelected ? onChangeCreateWalletNetwork : null}>
              <T id="advancedDaemon.toggle.testnet" m="Testnet" />
            </div>
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default CreateWalletForm;
