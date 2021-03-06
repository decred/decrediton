import { FormattedMessage as T } from "react-intl";
import { classNames, Tooltip } from "pi-ui";
import { RemoveWalletButton } from "buttons";
import { FormattedRelative } from "shared";
import { NewSeedTabMsg, RestoreTabMsg } from "../../messages";
import { FormContainer, Row } from "../../helpers";
import styles from "./Form.module.css";

const CreateRestoreButtons = ({ showCreateWalletForm }) => (
  <>
    <div
      className={classNames(styles.displayWallet, styles.new)}
      onClick={() => showCreateWalletForm(true)}>
      <div className={classNames(styles.walletIcon, styles.createnew)} />
      <div className={styles.displayWalletName}>
        <NewSeedTabMsg />
      </div>
    </div>
    <div
      className={classNames(styles.displayWallet, styles.new)}
      onClick={() => showCreateWalletForm(false)}>
      <div className={classNames(styles.walletIcon, styles.restore)} />
      <div className={styles.displayWalletName}>
        <RestoreTabMsg />
      </div>
    </div>
  </>
);

const WalletTypeLabel = ({ isWatchingOnly, finished, isTrezor, isPrivacy }) => {
  if (isPrivacy) return <T id="walletselection.privacy" m="Privacy" />;
  if (isTrezor) return <T id="walletselection.trezor" m="Trezor" />;
  if (isWatchingOnly)
    return <T id="walletselection.watchOnly" m="Watch Only" />;
  if (!finished)
    return <T id="walletselection.setupIncomplete" m="Setup incomplete" />;
  return null;
};

const WalletSelectionForm = ({
  availableWallets,
  showCreateWalletForm,
  onRemoveWallet,
  selectedWallet,
  onChangeAvailableWallets,
  onToggleEditWallet,
  editWallets,
  submitChosenWallet
}) => (
  <div>
    <FormContainer>
      <Row>
        {availableWallets.map((wallet) => {
          const selected =
            selectedWallet &&
            selectedWallet.value.wallet === wallet.value.wallet &&
            wallet.network === selectedWallet.network;
          return (
            <div
              className={
                selected && !editWallets
                  ? classNames(styles.displayWallet, styles.selected)
                  : styles.displayWallet
              }
              key={wallet.label}
              onClick={
                !editWallets ? () => onChangeAvailableWallets(wallet) : null
              }>
              {editWallets && (
                <div className={styles.displayWalletButtons}>
                  <Tooltip
                    content={
                      <T
                        id="walletselection.removeWalletButton"
                        m="Remove Wallet"
                      />
                    }>
                    <RemoveWalletButton
                      className={classNames(
                        styles.displayWalletButton,
                        styles.remove
                      )}
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
                    ? classNames(styles.displayWalletComplete, styles.selected)
                    : styles.displayWalletComplete
                }>
                <WalletTypeLabel
                  isWatchingOnly={wallet.isWatchingOnly}
                  isTrezor={wallet.value.isTrezor}
                  finished={wallet.finished}
                  isPrivacy={wallet.value.isPrivacy}
                />
              </div>
              <div
                className={
                  selected && !editWallets
                    ? classNames(styles.walletIcon, styles.selected)
                    : classNames(styles.walletIcon, styles.wallet)
                }
              />
              <div
                className={
                  selected && !editWallets
                    ? classNames(styles.displayWalletName, styles.selected)
                    : styles.displayWalletName
                }>
                {wallet.value.wallet}
              </div>
              <div
                className={
                  selected && !editWallets
                    ? classNames(
                        styles.displayWalletLastAccess,
                        styles.selected
                      )
                    : styles.displayWalletLastAccess
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
                    className={styles.displayWalletLaunch}
                    onClick={() => submitChosenWallet({ selectedWallet })}>
                    <T id="walletselection.launchWallet" m="Launch Wallet " />
                  </div>
                  <span className={styles.launchArrowBounce}>&#8594;</span>
                </>
              )}
            </div>
          );
        })}
        <CreateRestoreButtons {...{ showCreateWalletForm }} />
        {editWallets ? (
          <Tooltip
            content={<T id="walletselection.closeEditWallets" m="Close" />}>
            <div
              className={classNames(styles.editWalletsButton, styles.close)}
              onClick={onToggleEditWallet}
            />
          </Tooltip>
        ) : (
          <Tooltip
            content={<T id="walletselection.editWallets" m="Edit Wallets" />}>
            <div
              className={styles.editWalletsButton}
              onClick={onToggleEditWallet}
            />
          </Tooltip>
        )}
      </Row>
    </FormContainer>
  </div>
);

export default WalletSelectionForm;
