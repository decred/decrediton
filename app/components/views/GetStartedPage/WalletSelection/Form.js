import CreateWalletForm from "./CreateWalletForm";
import SelectAvailableWalletsForm from "./SelectAvailableWalletsForm";
import { FormattedMessage as T, injectIntl } from "react-intl";
import { KeyBlueButton, RemoveWalletButton } from "buttons";
import "style/LoginForm.less";

const WalletSelectionBodyBase = ({
  availableWallets,
  sideActive,
  onShowCreateWallet,
  onShowSelectWallet,
  createWallet,
  startWallet,
  onRemoveWallet,
  selectedWallet,
  intl,
  ...props,
}) => {
  return (
    availableWallets && availableWallets.length > 0 ?
      <Aux>
        <div className="advanced-page-toggle">
          <div className="text-toggle">
            <div className={"text-toggle-button-left " + (!sideActive && "text-toggle-button-active")} onClick={sideActive ? onShowCreateWallet : null}>
              <T id="advancedDaemon.toggle.remote" m="Select Available Wallet" />
            </div>
            <div className={"text-toggle-button-right " + (sideActive && "text-toggle-button-active")} onClick={!sideActive ? onShowSelectWallet : null}>
              <T id="advancedDaemon.toggle.appdata" m="Create New Wallet" />
            </div>
          </div>
        </div>
        <div className="advanced-page-form toggle">
          {sideActive ? <CreateWalletForm {...{ ...props, intl }} />:<SelectAvailableWalletsForm {...{ ...props, intl, selectedWallet, availableWallets }} />}
          <div className="loader-bar-buttons">
            {sideActive ?
              <KeyBlueButton onClick={createWallet}>
                <T id="wallet.create.button" m="Create new wallet" />
              </KeyBlueButton> :
              <Aux>
                <KeyBlueButton onClick={startWallet}>
                  <T id="wallet.form.start.btn" m="Start selected wallet"/>
                </KeyBlueButton>
                <RemoveWalletButton
                  modalTitle={<T id="stakepools.list.removeConfirmTitle" m="Remove {wallet}"
                    values={{ wallet: (<span className="mono">{selectedWallet && selectedWallet.label}</span>) }}/>}
                  buttonLabel={<T id="stakepools.list.btnRemove" m="Remove"/>}
                  modalContent={
                    <T id="stakepools.list.confirmRemove" m="Warning this action is permanent! Please make sure you have backed up your wallet's seed before proceeding."/>}
                  onSubmit={() => onRemoveWallet(selectedWallet)}
                  danger/>
              </Aux>
            }
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
