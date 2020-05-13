import { FormattedMessage as T } from "react-intl";
import { RemoveWalletButton } from "buttons";
import { NewSeedTabMsg, RestoreTabMsg } from "../messages";
import { Tooltip, FormattedRelative } from "shared";

const CreateRestoreButtons = ({ showCreateWalletForm }) => (
  <>
    <div
      className="display-wallet new"
      onClick={() => showCreateWalletForm(true)}>
      <div className="wallet-icon createnew" />
      <div className="display-wallet-name">
        <NewSeedTabMsg />
      </div>
    </div>
    <div
      className="display-wallet new"
      onClick={() => showCreateWalletForm(false)}>
      <div className="wallet-icon restore" />
      <div className="display-wallet-name">
        <RestoreTabMsg />
      </div>
    </div>
  </>
);

const WalletTypeLabel = ({ isWatchingOnly, finished, isTrezor }) => {
  if (isTrezor) return <T id="walletselection.trezor" m="Trezor" />;
  if (isWatchingOnly)
    return <T id="walletselection.watchOnly" m="Watch Only" />;
  if (!finished)
    return <T id="walletselection.setupIncomplete" m="Setup incomplete" />;
  return null;
};

const WalletSelectionBodyBase = ({
  availableWallets,
  showCreateWalletForm,
  onRemoveWallet,
  selectedWallet,
  onChangeAvailableWallets,
  onToggleEditWallet,
  editWallets,
  maxWalletCount,
  submitChosenWallet
}) => (
  <div className="advanced-page">
    <div className="advanced-page-form">
      <div className="advanced-daemon-row">
        {availableWallets.map((wallet) => {
          const selected =
            selectedWallet &&
            selectedWallet.value.wallet === wallet.value.wallet &&
            wallet.network === selectedWallet.network;
          return (
            <div
              className={
                selected && !editWallets
                  ? "display-wallet selected"
                  : "display-wallet"
              }
              key={wallet.label}
              onClick={
                !editWallets ? () => onChangeAvailableWallets(wallet) : null
              }>
              {editWallets && (
                <div className="display-wallet-buttons">
                  <Tooltip
                    text={
                      <T
                        id="walletselection.removeWalletButton"
                        m="Remove Wallet"
                      />
                    }>
                    <RemoveWalletButton
                      className="display-wallet-button remove"
                      modalTitle={
                        <T
                          id="walletselection.removeConfirmModal.title"
                          m="Remove {wallet}"
                          values={{
                            wallet: (
                              <span className="mono">
                                {wallet.value.wallet}
                              </span>
                            )
                          }}
                        />
                      }
                      modalContent={
                        <T
                          id="walletselection.removeConfirmModal.content"
                          m="Warning this action is permanent! Please make sure you have backed up your wallet's seed before proceeding."
                        />
                      }
                      onSubmit={() => onRemoveWallet(wallet)}
                    />
                  </Tooltip>
                </div>
              )}
              <div
                className={
                  selected && !editWallets
                    ? "display-wallet-complete selected"
                    : "display-wallet-complete"
                }>
                <WalletTypeLabel
                  isWatchingOnly={wallet.isWatchingOnly}
                  isTrezor={wallet.value.isTrezor}
                  finished={wallet.finished}
                />
              </div>
              <div
                className={
                  selected && !editWallets
                    ? "wallet-icon selected"
                    : "wallet-icon wallet"
                }
              />
              <div
                className={
                  selected && !editWallets
                    ? "display-wallet-name selected"
                    : "display-wallet-name"
                }>
                {wallet.value.wallet}
              </div>
              <div
                className={
                  selected && !editWallets
                    ? "display-wallet-last-access selected"
                    : "display-wallet-last-access"
                }>
                {wallet.lastAccess && (
                  <>
                    <T id="walletselection.lastAccess" m="Last accessed" />:{" "}
                    <FormattedRelative
                      value={wallet.lastAccess}
                      updateInterval={1 * 1000}
                    />
                  </>
                )}
              </div>
              {!editWallets && selected && (
                <>
                  <div
                    className={"display-wallet-launch"}
                    onClick={() => submitChosenWallet(selectedWallet)}>
                    <T id="walletselection.launchWallet" m="Launch Wallet " />
                  </div>
                  <span className="launch-arrow-bounce">&#8594;</span>
                </>
              )}
            </div>
          );
        })}
        {availableWallets.length < maxWalletCount && (
          <CreateRestoreButtons {...{ showCreateWalletForm }} />
        )}
        {editWallets ? (
          <Tooltip text={<T id="walletselection.closeEditWallets" m="Close" />}>
            <div
              className="edit-wallets-button close"
              onClick={onToggleEditWallet}
            />
          </Tooltip>
        ) : (
          <Tooltip
            text={<T id="walletselection.editWallets" m="Edit Wallets" />}>
            <div className="edit-wallets-button" onClick={onToggleEditWallet} />
          </Tooltip>
        )}
      </div>
    </div>
  </div>
);

export const WalletSelectionFormBody = WalletSelectionBodyBase;
