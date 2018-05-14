import CreateWalletForm from "./CreateWalletForm";
import { FormattedMessage as T, injectIntl, FormattedRelative } from "react-intl";
import { KeyBlueButton, RemoveWalletButton, InvisibleButton } from "buttons";

const WalletSelectionBodyBase = ({
  availableWallets,
  createWallet,
  showCreateWalletForm,
  hideCreateWalletForm,
  createWalletForm,
  startWallet,
  onRemoveWallet,
  selectedWallet,
  onChangeAvailableWallets,
  onEditWallets,
  onCloseEditWallets,
  editWallets,
  intl,
  ...props,
}) => {
  console.log(availableWallets);
  return (
    availableWallets && availableWallets.length > 0 && !createWalletForm ?
      <div className="advanced-page">
        <div className="advanced-page-form">
          <div className="advanced-daemon-row">
            {availableWallets.map(wallet => {
              const selected = wallet.value.wallet == selectedWallet.value.wallet && wallet.network == selectedWallet.network;
              return (
                <div className={selected ? "display-wallet selected" : "display-wallet"} key={wallet.label} onClick={() => onChangeAvailableWallets(wallet)}>
                  {editWallets &&
                    <div className="display-wallet-buttons">
                      <RemoveWalletButton
                        className="display-wallet-button remove"
                        modalTitle={<T id="walletselection.removeConfirmModal.title" m="Remove {wallet}"
                          values={{ wallet: (<span className="mono">{selectedWallet && selectedWallet.label}</span>) }}/>}
                        modalContent={
                          <T id="walletselection.removeConfirmModal.content" m="Warning this action is permanent! Please make sure you have backed up your wallet's seed before proceeding."/>}
                        onSubmit={() => onRemoveWallet(wallet)} />
                    </div>}
                  <div className={selected ? "wallet-icon selected" : "wallet-icon wallet"}/>
                  <div className={selected ? "display-wallet-name selected" : "display-wallet-name"}>
                    {wallet.value.wallet}
                  </div>
                  {wallet.lastAccess ?
                    <div className={selected ? "display-wallet-last-access selected" : "display-wallet-last-access"}>
                      <T id="walletselection.lastAccess" m="Last accessed"/>: <FormattedRelative value={wallet.lastAccess} updateInterval={1*1000}/>
                    </div> :
                    <div/>
                  }
                  <div className={selected ? "display-wallet-complete selected" : "display-wallet-complete"}>
                    {!wallet.finished && "Setup incomplete"}
                  </div>
                </div>
              );
            })}
            {editWallets ?
              <div className="edit-wallets-button close" onClick={onCloseEditWallets}/> :
              <div className="edit-wallets-button" onClick={onEditWallets}/>
            }
            {availableWallets.length < 3 &&
              <div className="display-wallet new" onClick={showCreateWalletForm}>
                <div className="display-wallet-network" />
                <div className="wallet-icon createnew" />
                <div className="display-wallet-name">
                  <T id="getStarted.newSeedTab" m="Create a New Wallet"/>
                </div>
              </div>
            }
          </div>
        </div>
      </div> :
      <div className="advanced-page">
        <div className="advanced-page-form">
          <CreateWalletForm {...{ ...props, intl }} />
          <div className="loader-bar-buttons">
            {availableWallets && availableWallets.length > 0 &&
              <InvisibleButton onClick={hideCreateWalletForm}>
                <T id="advancedStartup.cancel" m="Cancel"/>
              </InvisibleButton>
            }
            <KeyBlueButton onClick={createWallet}>
              <T id="wallet.create.button" m="Create new wallet" />
            </KeyBlueButton>
          </div>
        </div>
      </div>
  );
};

export const WalletSelectionFormBody = injectIntl(WalletSelectionBodyBase);
