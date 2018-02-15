import { FormattedMessage as T } from "react-intl";
import { WalletSelect } from "inputs";
import { KeyBlueButton, RemoveWalletButton } from "buttons";
import "style/LoginForm.less";

const SelectAvailableWalletsForm = ({
  availableWallets,
  selectedWallet,
  startWallet,
  onRemoveWallet,
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
        <RemoveWalletButton
          modalTitle={<T id="stakepools.list.removeConfirmTitle" m="Remove {wallet}"
            values={{wallet: (<span className="mono">{selectedWallet && selectedWallet.label}</span>)}}/>}
          buttonLabel={<T id="stakepools.list.btnRemove" m="Remove"/>}
          modalContent={
            <T id="stakepools.list.confirmRemove" m="Warning this action is permanent! Please make sure you have backed up your wallet's seed before proceeding."/>}
          onSubmit={() => onRemoveWallet(selectedWallet)}
          danger/>
      </div>
    </Aux>
  );
};

export default SelectAvailableWalletsForm;
