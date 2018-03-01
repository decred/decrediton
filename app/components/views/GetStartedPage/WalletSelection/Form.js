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
                return (
                  <div className={wallet.value.wallet == selectedWallet.value.wallet ? "display-wallet selected" : "display-wallet"} key={wallet.value.wallet} onClick={() => onChangeAvailableWallets(wallet)}>
                    <div className={wallet.value.wallet == selectedWallet.value.wallet ? "wallet-icon selected" : "wallet-icon wallet"}/>
                    <div className="display-wallet-name">
                      {wallet.value.wallet}
                    </div>
                    <RemoveWalletButton
                      modalTitle={<T id="stakepools.list.removeConfirmTitle" m="Remove {wallet}"
                        values={{ wallet: (<span className="mono">{selectedWallet && selectedWallet.label}</span>) }}/>}
                      buttonLabel={<T id="stakepools.list.btnRemove" m="Remove"/>}
                      modalContent={
                        <T id="stakepools.list.confirmRemove" m="Warning this action is permanent! Please make sure you have backed up your wallet's seed before proceeding."/>}
                      onSubmit={() => onRemoveWallet(wallet)} />
                  </div>
                );
              })}
            </div>
            <div className="loader-bar-buttons">
              <KeyBlueButton onClick={createWallet}>
                <T id="wallet.create.button" m="Create new wallet" />
              </KeyBlueButton>
              <KeyBlueButton onClick={startWallet}>
                <T id="wallet.form.start.btn" m="Start selected wallet"/>
              </KeyBlueButton>
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
