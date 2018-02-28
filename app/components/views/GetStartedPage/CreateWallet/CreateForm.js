import CreateWalletForm from "./CreateWalletForm";
import ExistingOrNewScreen from "./ExistingOrNewScreen";
import "style/GetStarted.less";

const CreateForm = ({
  existingOrNew,
  onReturnToNewSeed,
  onReturnToExistingOrNewScreen,
  onSetCreateWalletFromExisting
}) => (
  existingOrNew ?
    <ExistingOrNewScreen {...{ onSetCreateWalletFromExisting }} /> :
    <CreateWalletForm {...{ onReturnToNewSeed, onReturnToExistingOrNewScreen } }/>
);

export default CreateForm;
