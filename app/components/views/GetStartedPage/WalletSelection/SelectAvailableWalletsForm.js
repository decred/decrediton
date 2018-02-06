import { FormattedMessage as T } from "react-intl";
import { WalletSelect } from "inputs";
import { KeyBlueButton } from "buttons";
import "style/LoginForm.less";

const SelectAvailableWalletsForm = ({
  availableWallets,
  selectedWallet,
  startWallet,
  onChangeAvailableWallets,
}) => {

  return (
    <Aux>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="wallet.form.available.label" m="Available Wallets" />:
        </div>
        <div className="advanced-daemon-input">
          <WalletSelect className="stakepool-unconfigured-select"
            options={availableWallets}
            value={selectedWallet}
            onChange={onChangeAvailableWallets} />
        </div>
      </div>
      <div className="advanced-daemon-row">
        <KeyBlueButton onClick={startWallet}>
          <T id="wallet.form.start.btn" m="Start selected wallet"/>
        </KeyBlueButton>
      </div>
    </Aux>
  );
};

export default SelectAvailableWalletsForm;
