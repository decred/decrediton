import CreateWalletForm from "./CreateWalletForm";
import ExistingOrNewScreen from "./ExistingOrNewScreen";
import "style/GetStarted.less";

const CreateForm = ({
  existingOrNew,
  onReturnToNewSeed,
  onReturnToExistingOrNewScreen,
  onSetCreateWalletFromExisting,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft
}) => (
  existingOrNew ?
    <ExistingOrNewScreen {...{ onSetCreateWalletFromExisting,
      getCurrentBlockCount,
      getNeededBlocks,
      getEstimatedTimeLeft }} /> :
    <CreateWalletForm {...{ onReturnToNewSeed, onReturnToExistingOrNewScreen,
      getCurrentBlockCount,
      getNeededBlocks,
      getEstimatedTimeLeft } }/>
);

export default CreateForm;
