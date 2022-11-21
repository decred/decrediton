import { FormattedMessage as T } from "react-intl";
import CreateWalletForm from "./CreateWalletForm";
import CreateTrezorWalletForm from "./CreateTrezorWalletForm";
import { usePreCreateWallet } from "./hooks";
import { injectIntl } from "react-intl";
import NoDevicePage from "views/TrezorPage/NoDevicePage";
import styles from "./PreCreateWallet.module.css";
import { InvisibleButton } from "buttons";

const PreCreateWallet = ({
  intl,
  onSendContinue,
  onSendBack,
  onSendError,
  isCreateNewWallet,
  onShowCreateWallet,
  isTrezor,
  creatingWallet
}) => {
  const {
    availableWallets,
    newWalletName,
    hasFailedAttemptName,
    hasFailedAttemptPubKey,
    getDaemonSynced,
    isWatchingOnly,
    walletMasterPubKey,
    masterPubKeyError,
    walletNameError,
    isSPV,
    trezorDevice,
    hideCreateWalletForm,
    onChangeCreateWalletName,
    createWallet,
    toggleWatchOnly,
    onChangeCreateWalletMasterPubKey,
    disableCoinTypeUpgrades,
    toggleDisableCoinTypeUpgrades,
    gapLimit,
    setGapLimit,
    connectTrezor
  } = usePreCreateWallet({
    onSendContinue,
    onSendBack,
    onSendError,
    isCreateNewWallet,
    onShowCreateWallet,
    isTrezor
  });

  return isTrezor && !trezorDevice ? (
    <div className={styles.noDeviceContainer}>
      <NoDevicePage onConnect={connectTrezor} />
      <InvisibleButton onClick={hideCreateWalletForm} className={styles.backBt}>
        <T id="preCreateWallet.noDevice.back" m="Back" />
      </InvisibleButton>
    </div>
  ) : isTrezor ? (
    <CreateTrezorWalletForm
      {...{
        selectedWallet: availableWallets[0],
        availableWallets,
        isCreateNewWallet,
        newWalletName,
        hasFailedAttemptName,
        hasFailedAttemptPubKey,
        getDaemonSynced,
        isWatchingOnly,
        isTrezor,
        walletMasterPubKey,
        masterPubKeyError,
        walletNameError,
        isSPV,
        creatingWallet,
        hideCreateWalletForm,
        onChangeCreateWalletName,
        createWallet,
        toggleWatchOnly,
        onChangeCreateWalletMasterPubKey,
        intl,
        disableCoinTypeUpgrades,
        toggleDisableCoinTypeUpgrades,
        gapLimit,
        setGapLimit
      }}
    />
  ) : (
    <CreateWalletForm
      {...{
        selectedWallet: availableWallets[0],
        availableWallets,
        isCreateNewWallet,
        newWalletName,
        hasFailedAttemptName,
        hasFailedAttemptPubKey,
        getDaemonSynced,
        isWatchingOnly,
        isTrezor,
        walletMasterPubKey,
        masterPubKeyError,
        walletNameError,
        isSPV,
        creatingWallet,
        hideCreateWalletForm,
        onChangeCreateWalletName,
        createWallet,
        toggleWatchOnly,
        onChangeCreateWalletMasterPubKey,
        intl,
        disableCoinTypeUpgrades,
        toggleDisableCoinTypeUpgrades,
        gapLimit,
        setGapLimit
      }}
    />
  );
};

export default injectIntl(PreCreateWallet);
