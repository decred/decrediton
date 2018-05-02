import CreateWalletForm from "./CreateWalletForm";
import ExistingOrNewScreen from "./ExistingOrNewScreen";
import "style/GetStarted.less";

const CreateForm = ({
  existingOrNew,
  onReturnToNewSeed,
  onReturnToWalletSelection,
  onReturnToExistingOrNewScreen,
  onSetCreateWalletFromExisting,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  getDaemonSynced
}) => (
  existingOrNew ?
    <ExistingOrNewScreen {...{ onSetCreateWalletFromExisting,
      onReturnToWalletSelection,
      getCurrentBlockCount,
      getNeededBlocks,
      getEstimatedTimeLeft,
      getDaemonSynced }} /> :
    <CreateWalletForm {...{ onReturnToNewSeed, onReturnToExistingOrNewScreen,
      getCurrentBlockCount,
      getNeededBlocks,
      getEstimatedTimeLeft,
    } }/>
);

export default CreateForm;
