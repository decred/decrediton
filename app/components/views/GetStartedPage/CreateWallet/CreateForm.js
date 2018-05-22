import CreateWalletForm from "./CreateWalletForm";
import ExistingOrNewScreen from "./ExistingOrNewScreen";
import "style/GetStarted.less";

const CreateForm = ({
  availableWallets,
  existingOrNew,
  createNewWallet,
  onReturnToNewSeed,
  onReturnToWalletSelection,
  onReturnToExistingOrNewScreen,
  onSetCreateWalletFromExisting,
  onSetWalletPrivatePassphrase,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  getDaemonSynced,
}) => (
  (availableWallets.length == 0 && existingOrNew) || !createNewWallet ?
    <ExistingOrNewScreen {...{ onSetCreateWalletFromExisting,
      onReturnToWalletSelection,
      getCurrentBlockCount,
      getNeededBlocks,
      getEstimatedTimeLeft,
      getDaemonSynced,
      onSetWalletPrivatePassphrase }} /> :
    <CreateWalletForm {...{
      onReturnToNewSeed,
      onReturnToExistingOrNewScreen,
      onReturnToWalletSelection,
      getCurrentBlockCount,
      getNeededBlocks,
      getEstimatedTimeLeft,
      onSetWalletPrivatePassphrase
    } }/>
);

export default CreateForm;
