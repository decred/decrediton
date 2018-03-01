import CreateWalletForm from "./CreateWalletForm";
import { FormattedMessage as T, injectIntl } from "react-intl";
import { KeyBlueButton, RemoveWalletButton } from "buttons";
import "style/LoginForm.less";

const WalletSelectionBodyBase = ({
  availableWallets,
  createWallet,
  startWallet,
  onRemoveWallet,
  selectedWallet,
  onChangeAvailableWallets,
  intl,
  ...props,
}) => {
  return (
    availableWallets && availableWallets.length > 0 ?
      <Aux>
        <div className="advanced-page">
          <div className="advanced-page-form">
            <div className="advanced-daemon-row">
              {availableWallets.map(wallet => {
                const selected = wallet.value.wallet == selectedWallet.value.wallet;
                return (
                  <div className={selected ? "display-wallet selected" : "display-wallet"} key={wallet.value.wallet} onClick={() => onChangeAvailableWallets(wallet)}>
                    <div className={selected ? "wallet-icon selected" : "wallet-icon wallet"}/>
                    <div className={selected ? "display-wallet-name selected" : "display-wallet-name"}>
                      {wallet.value.wallet}
                    </div>
                    {selected &&
                    <div className="display-wallet-buttons">
                      <KeyBlueButton className="display-wallet-button start" onClick={startWallet} />
                      <RemoveWalletButton
                        className="display-wallet-button remove"
                        modalTitle={<T id="stakepools.list.removeConfirmTitle" m="Remove {wallet}"
                          values={{ wallet: (<span className="mono">{selectedWallet && selectedWallet.label}</span>) }}/>}
                        modalContent={
                          <T id="stakepools.list.confirmRemove" m="Warning this action is permanent! Please make sure you have backed up your wallet's seed before proceeding."/>}
                        onSubmit={() => onRemoveWallet(wallet)} />
                    </div>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Aux> :
      <div className="advanced-page-form">
        <CreateWalletForm {...{ ...props, intl }} />
        <div className="loader-bar-buttons">
          <KeyBlueButton onClick={createWallet}>
            <T id="wallet.create.button" m="Create new wallet" />
          </KeyBlueButton>
        </div>
      </div>
  );
};

export const WalletSelectionFormBody = injectIntl(WalletSelectionBodyBase);
