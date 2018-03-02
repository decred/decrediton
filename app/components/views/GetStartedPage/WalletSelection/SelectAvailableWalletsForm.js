import { FormattedMessage as T } from "react-intl";
import { WalletSelect } from "inputs";
import "style/LoginForm.less";

const SelectAvailableWalletsForm = ({
  availableWallets,
  selectedWallet,
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
      </div>
    </Aux>
  );
};

export default SelectAvailableWalletsForm;
