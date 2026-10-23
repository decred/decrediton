import { FormattedMessage as T } from "react-intl";
import CreateWalletForm from "./CreateWalletForm";
import CreateTrezorWalletForm from "./CreateTrezorWalletForm";
import CreateLedgerWalletForm from "./CreateLedgerWalletForm";
import { usePreCreateWallet } from "./hooks";
import { injectIntl } from "react-intl";
import NoDevicePage from "views/TrezorPage/NoDevicePage";
import { default as NoDevicePageLedger } from "views/LedgerPage/NoDevicePage";
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
  creatingWallet,
  isLedger
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
    ledgerDevice,
    hideCreateWalletForm,
    onChangeCreateWalletName,
    createWallet,
    toggleWatchOnly,
    onChangeCreateWalletMasterPubKey,
    disableCoinTypeUpgrades,
    toggleDisableCoinTypeUpgrades,
    gapLimit,
    setGapLimit,
    connectTrezor,
    connectLedger
  } = usePreCreateWallet({
    onSendContinue,
    onSendBack,
    onSendError,
    isCreateNewWallet,
    onShowCreateWallet,
    isTrezor,
    isLedger
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
        setGapLimit,
        isLedger
      }}
    />
  ) : isLedger && !ledgerDevice ? (
    <div className={styles.noDeviceContainer}>
      <NoDevicePageLedger onConnect={connectLedger} />
      <InvisibleButton onClick={hideCreateWalletForm} className={styles.backBt}>
        <T id="preCreateWallet.noDevice.back" m="Back" />
      </InvisibleButton>
    </div>
  ) : isLedger ? (
    <CreateLedgerWalletForm
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
        setGapLimit,
        isLedger
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
        setGapLimit,
        isLedger
      }}
    />
  );
};

export default injectIntl(PreCreateWallet);
